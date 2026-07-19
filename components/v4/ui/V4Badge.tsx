import type { CapabilityStatus } from "@/lib/v4/site-map";
import { STATUS_LABEL } from "@/lib/v4/site-map";

const STATUS_VAR: Record<CapabilityStatus, string> = {
  available: "var(--v4-status-available)",
  beta: "var(--v4-status-beta)",
  planned: "var(--v4-status-planned)",
  research: "var(--v4-status-research)",
};

export function V4Badge({ status, label }: { status: CapabilityStatus; label?: string }) {
  return (
    <span className="v4-pill" style={{ color: STATUS_VAR[status] }}>
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
