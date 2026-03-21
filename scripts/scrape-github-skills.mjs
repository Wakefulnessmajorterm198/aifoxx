/**
 * GitHub Skills Scraper
 * Fetches Claude-related repos from GitHub and writes src/data/skills.json
 *
 * Usage:
 *   GITHUB_TOKEN=your_token node scripts/scrape-github-skills.mjs
 *
 * Or create .env.local with GITHUB_TOKEN=... and run:
 *   node -e "require('dotenv').config({path:'.env.local'})" scripts/scrape-github-skills.mjs
 *
 * Requires: GITHUB_TOKEN env var for 5000 req/hr (60/hr without it)
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local if present
const __envPath = join(dirname(fileURLToPath(import.meta.url)), "../.env.local");
if (existsSync(__envPath)) {
  readFileSync(__envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_PATH = join(ROOT, "src/data/skills.json");
const TOOLS_PATH = join(ROOT, "src/data/tools.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

// Search queries to run against GitHub
const SEARCH_QUERIES = [
  "topic:mcp-server",
  "topic:claude-mcp",
  "topic:claude-code",
  "topic:claude-skill",
  "topic:model-context-protocol",
];

// Map GitHub repo topics/names to skill_type
function inferSkillType(topics, name, description) {
  const all = [...topics, name, description].join(" ").toLowerCase();
  if (all.includes("mcp") || all.includes("model-context-protocol")) {
    return "mcp-server";
  }
  return "claude-code-skill";
}

// Map repo to a tool slug by matching repo name/description against tool names
function mapToToolSlug(repoName, repoDescription, tools) {
  const text = `${repoName} ${repoDescription}`.toLowerCase();
  for (const tool of tools) {
    const toolName = tool.name.toLowerCase();
    if (text.includes(toolName) && toolName.length > 3) {
      return { slug: tool.slug, name: tool.name };
    }
  }
  return { slug: null, name: repoName };
}

// Infer category from topics or tool category
function inferCategory(topics, toolCategory) {
  if (toolCategory) return toolCategory;
  if (topics.includes("database") || topics.includes("sql")) return "Database";
  if (topics.includes("devtools") || topics.includes("developer-tools")) return "Dev Tools";
  if (topics.includes("productivity")) return "Productivity";
  if (topics.includes("security")) return "Security";
  if (topics.includes("ai") || topics.includes("llm")) return "AI Assistants";
  return "Developer Tools";
}

async function fetchPage(query, page = 1) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=50&page=${page}`;
  const res = await fetch(url, { headers: HEADERS });

  if (res.status === 403) {
    console.warn("Rate limit hit. Add a GITHUB_TOKEN env var to increase limits.");
    return [];
  }
  if (!res.ok) {
    console.warn(`GitHub API error ${res.status} for query: ${query}`);
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

async function scrape() {
  console.log("Loading tools.json for slug mapping...");
  const tools = JSON.parse(readFileSync(TOOLS_PATH, "utf-8"));
  console.log(`Loaded ${tools.length} tools.`);

  const seen = new Set();
  const skills = [];

  for (const query of SEARCH_QUERIES) {
    console.log(`\nFetching: ${query}`);
    const repos = await fetchPage(query);
    console.log(`  Found ${repos.length} repos`);

    for (const repo of repos) {
      if (seen.has(repo.html_url)) continue;
      seen.add(repo.html_url);

      const { slug: toolSlug, name: toolName } = mapToToolSlug(
        repo.name,
        repo.description || "",
        tools
      );

      const topics = repo.topics || [];
      const skillType = inferSkillType(topics, repo.name, repo.description || "");
      const category = inferCategory(
        topics,
        toolSlug ? tools.find((t) => t.slug === toolSlug)?.category : null
      );

      skills.push({
        id: repo.full_name.replace("/", "-").toLowerCase(),
        name: repo.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description || "",
        github_url: repo.html_url,
        stars: repo.stargazers_count,
        topics,
        tool_slug: toolSlug,
        tool_name: toolName,
        category,
        skill_type: skillType,
        last_updated: new Date().toISOString().split("T")[0],
      });
    }

    // Respect rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Sort by stars descending
  skills.sort((a, b) => b.stars - a.stars);

  writeFileSync(OUTPUT_PATH, JSON.stringify(skills, null, 2));
  console.log(`\nDone. Wrote ${skills.length} skills to src/data/skills.json`);
}

scrape().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
