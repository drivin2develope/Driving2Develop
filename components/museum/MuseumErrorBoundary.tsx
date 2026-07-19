"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  label?: string;
}
interface State {
  error: Error | null;
}

/**
 * Isolates a single museum/composer section so a broken historical version
 * can't take down the whole preview or composition. React error boundaries
 * must be class components - there's no hooks equivalent.
 */
export class MuseumErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="v4-scope flex items-center gap-3 p-6 m-4 rounded-lg border text-sm"
          data-v4-theme="dark"
          style={{ borderColor: "var(--v4-red)", color: "var(--v4-text)", background: "var(--v4-bg-raised)" }}
        >
          <AlertTriangle size={18} style={{ color: "var(--v4-red)" }} />
          <span>
            {this.props.label ?? "This section"} failed to render: {this.state.error.message}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
