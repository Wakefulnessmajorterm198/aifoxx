import { SkillSchema, type Skill } from "@/types/skill";
import mcpData from "@/data/mcp-servers.json";
import ccData from "@/data/claude-code-skills.json";

export function validateSkills(): Skill[] {
  return [...mcpData, ...ccData].map((s) => SkillSchema.parse(s));
}

export const allSkills: Skill[] = validateSkills();

export function getSkillsByToolSlug(slug: string): Skill[] {
  return allSkills.filter((s) => s.tool_slug === slug);
}

export function getSkillsByCategory(category: string): Skill[] {
  return allSkills.filter(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );
}

function skillMatch(s: Skill, q: string): boolean {
  return (
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.tool_name.toLowerCase().includes(q) ||
    s.topics.some((t) => t.toLowerCase().includes(q))
  );
}

export function searchSkills(query: string): Skill[] {
  const q = query.trim().toLowerCase();
  if (!q) return allSkills;
  return allSkills.filter((s) => skillMatch(s, q));
}

export const allMcpServers: Skill[] = allSkills.filter(
  (s) => s.skill_type === "mcp-server"
);
export const allClaudeCodeSkills: Skill[] = allSkills.filter(
  (s) => s.skill_type === "claude-code-skill"
);

export function searchMcpServers(query: string): Skill[] {
  const q = query.trim().toLowerCase();
  if (!q) return allMcpServers;
  return allMcpServers.filter((s) => skillMatch(s, q));
}

export function searchClaudeCodeSkills(query: string): Skill[] {
  const q = query.trim().toLowerCase();
  if (!q) return allClaudeCodeSkills;
  return allClaudeCodeSkills.filter((s) => skillMatch(s, q));
}

export const SKILL_COUNTS = {
  total: allSkills.length,
  mcpServers: allSkills.filter((s) => s.skill_type === "mcp-server").length,
  claudeCodeSkills: allSkills.filter((s) => s.skill_type === "claude-code-skill").length,
};
