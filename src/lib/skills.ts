import { SkillSchema, type Skill } from "@/types/skill";
import skillsData from "@/data/skills.json";

export function validateSkills(): Skill[] {
  return skillsData.map((s) => SkillSchema.parse(s));
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

export function searchSkills(query: string): Skill[] {
  const q = query.trim().toLowerCase();
  if (!q) return allSkills;
  return allSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tool_name.toLowerCase().includes(q) ||
      s.topics.some((t) => t.toLowerCase().includes(q))
  );
}

export const SKILL_COUNTS = {
  total: allSkills.length,
  mcpServers: allSkills.filter((s) => s.skill_type === "mcp-server").length,
  claudeCodeSkills: allSkills.filter((s) => s.skill_type === "claude-code-skill").length,
};
