import { ArrowRight, type LucideIcon } from "lucide-react";

export interface FlowNode {
  icon: LucideIcon;
  label: string;
  desc: string;
  /** Marks a node that doesn't exist yet - rendered dashed, dimmer. */
  built?: boolean;
}

/**
 * Shared "system map" visual language: bordered nodes connected by arrows.
 * Used on real capability pages ("how it works", built=true throughout) and
 * planned-capability pages ("how it will work", built=false), so the two
 * never get confused for one another - a real page never looks conceptual,
 * and a roadmap page never looks like a screenshot of working software.
 */
export function V4FlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-0 overflow-x-auto">
      {nodes.map((node, i) => {
        const Icon = node.icon;
        const built = node.built ?? true;
        return (
          <div key={node.label} className="flex items-center md:flex-1 min-w-[180px]">
            <div
              className="v4-diagram-node p-5 flex-1"
              style={{ opacity: built ? 1 : 0.6, borderStyle: built ? "solid" : "dashed" }}
            >
              <Icon size={18} style={{ color: built ? "var(--v4-gold-b)" : "var(--v4-text-tertiary)" }} />
              <p className="text-sm font-medium mt-3">{node.label}</p>
              <p className="text-xs mt-1" style={{ color: "var(--v4-text-secondary)" }}>
                {node.desc}
              </p>
            </div>
            {i < nodes.length - 1 && (
              <div className="hidden md:flex items-center justify-center w-10 shrink-0">
                <ArrowRight size={16} style={{ color: "var(--v4-text-tertiary)" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
