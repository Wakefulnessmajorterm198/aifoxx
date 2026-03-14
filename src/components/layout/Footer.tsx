import { Github } from "lucide-react";
import Brand from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-border-dim bg-bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-3">
        <p className="font-mono text-xs text-text-muted tracking-wider">
          {Brand.copy.footer_line}
        </p>
        <p className="font-mono text-[11px] text-text-secondary text-center">
          Open source on{" "}
          <a
            href={Brand.product.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-text-primary transition-colors duration-150"
          >
            GitHub
          </a>
        </p>
        <p className="font-mono text-[11px] text-text-secondary text-center">
          Created by{" "}
          <a
            href={Brand.creators.primary.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-text-primary transition-colors duration-150"
          >
            @{Brand.creators.primary.name}
          </a>{" "}
          and{" "}
          <a
            href={Brand.creators.co_creator.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-text-primary transition-colors duration-150"
          >
            @{Brand.creators.co_creator.name}
          </a>
        </p>
        <div className="flex items-center gap-6 font-mono text-xs text-text-muted">
          <a
            href={Brand.product.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text-secondary transition-colors duration-150"
          >
            <Github size={14} />
            Repository
          </a>
          <a
            href={Brand.contact.pull_requests}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text-secondary transition-colors duration-150"
          >
            <Github size={14} />
            Pull Requests
          </a>
          <a
            href={Brand.contact.discussions}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text-secondary transition-colors duration-150"
          >
            <Github size={14} />
            Discussions
          </a>
          <span>MIT License</span>
          <span>v{Brand.product.version}</span>
        </div>
      </div>
    </footer>
  );
}
