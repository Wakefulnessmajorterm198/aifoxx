import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Star, ExternalLink } from "lucide-react";
import { allSkills, searchSkills, SKILL_COUNTS } from "@/lib/skills";
import { type Skill, type SkillType } from "@/types/skill";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PageMeta } from "@/components/seo/PageMeta";
import Brand from "@/lib/brand";

const SKILLS_PER_PAGE = 18;

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="relative overflow-hidden bg-bg-surface border border-border-default rounded-[6px] p-4 flex flex-col gap-3 transition-all duration-150 hover:border-accent-green/50 hover:shadow-glow">
      {/* Top bar accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent-green opacity-40" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 bg-bg-elevated border border-border-default rounded-[4px] flex items-center justify-center shrink-0">
            <Github size={14} className="text-text-secondary" />
          </div>
          <span className="font-display font-black text-text-primary text-sm truncate">
            {skill.name}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-accent-green border border-accent-green/40 px-1.5 py-0.5 rounded-[3px]">
          <Star size={10} className="fill-accent-green" />
          {skill.stars.toLocaleString()}
        </div>
      </div>

      {/* Description */}
      <p className="font-mono text-xs text-text-secondary line-clamp-2 min-w-0">
        {skill.description || "No description available."}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-dim mt-auto">
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-[3px] bg-bg-elevated border border-border-dim text-text-muted">
            {skill.skill_type === "mcp-server" ? "MCP Server" : "Claude Code"}
          </span>
          {skill.tool_slug && (
            <Link
              to={`/ai/${skill.tool_slug}`}
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-[10px] px-2 py-0.5 rounded-[3px] bg-bg-elevated border border-accent-green/30 text-accent-green hover:bg-accent-green/10 transition-colors"
            >
              {skill.tool_name}
            </Link>
          )}
        </div>
        <a
          href={skill.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-mono text-[10px] text-text-muted hover:text-text-primary transition-colors shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={10} />
          GitHub
        </a>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<SkillType | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let results = query.trim() ? searchSkills(query) : allSkills;
    if (activeType) results = results.filter((s) => s.skill_type === activeType);
    return results;
  }, [query, activeType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / SKILLS_PER_PAGE));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * SKILLS_PER_PAGE, pageSafe * SKILLS_PER_PAGE);

  const handleQueryChange = (v: string) => {
    setQuery(v);
    setPage(1);
  };

  const handleTypeChange = (v: SkillType | "") => {
    setActiveType(v);
    setPage(1);
  };

  return (
    <>
      <PageMeta
        title={`Claude Skills — MCP Servers & Claude Code Integrations | ${Brand.product.name_styled}`}
        description={`Browse ${SKILL_COUNTS.total}+ Claude skills: MCP servers and Claude Code integrations ranked by GitHub stars.`}
        url={`https://${Brand.product.domain}/skills`}
      />

      {/* Hero */}
      <section className="py-14 text-center px-4 border-b border-border-muted/30 bg-bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-accent-green border border-accent-green/30 px-3 py-1 rounded-[3px]">
            CLAUDE SKILLS
          </span>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary tracking-tight">
            MCP Servers &amp; Integrations
          </h1>
          <p className="font-mono text-sm text-text-secondary max-w-lg">
            {SKILL_COUNTS.total} GitHub repos — {SKILL_COUNTS.mcpServers} MCP servers,{" "}
            {SKILL_COUNTS.claudeCodeSkills} Claude Code skills. Ranked by stars.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mt-8">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search skills, tools, topics..."
            className="w-full bg-bg-elevated border border-border-default rounded-[6px] px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/60 transition-colors"
          />
        </div>
      </section>

      <PageWrapper>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(["", "mcp-server", "claude-code-skill"] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`font-mono text-xs px-3 py-1.5 rounded-[4px] border transition-all duration-150 ${
                  activeType === type
                    ? "bg-accent-green text-primary-foreground border-accent-green"
                    : "border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
                }`}
              >
                {type === "" ? `All (${filtered.length})` : type === "mcp-server" ? "MCP Servers" : "Claude Code Skills"}
              </button>
            ))}
            <span className="font-mono text-xs text-text-muted ml-auto">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid */}
          {paginated.length === 0 ? (
            <div className="bg-bg-elevated border-2 border-dashed border-border-dim rounded-[8px] py-20 text-center">
              <p className="font-display text-accent-red text-3xl font-black tracking-tight">NO RESULTS</p>
              <p className="font-mono text-text-secondary text-sm mt-3">Try a different search or filter.</p>
              <button
                onClick={() => { handleQueryChange(""); handleTypeChange(""); }}
                className="mt-6 font-mono text-xs text-accent-green hover:bg-accent-green hover:text-bg-base border border-accent-green px-4 py-2 rounded-sm transition-all duration-150"
              >
                RESET
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className="font-mono text-xs px-3 py-1.5 rounded-[4px] border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-overlay transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                PREV
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`font-mono text-xs min-w-8 px-2 py-1.5 rounded-[4px] border transition-all ${
                    n === pageSafe
                      ? "bg-accent-green text-primary-foreground border-accent-green"
                      : "border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                className="font-mono text-xs px-3 py-1.5 rounded-[4px] border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-overlay transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                NEXT
              </button>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
