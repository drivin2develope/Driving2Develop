"use client";

import dynamic from "next/dynamic";
import { ScenarioDTO } from "@/lib/scenario-types";
import { Skeleton } from "@/components/ui";

const PracticeRecorder = dynamic(() => import("@/components/PracticeRecorder").then((m) => m.PracticeRecorder), {
  ssr: false,
  loading: () => (
    <div className="px-5 md:px-8 pb-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-[420px] w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  ),
});

export function PracticeRecorderLoader({ scenario }: { scenario: ScenarioDTO }) {
  return <PracticeRecorder scenario={scenario} />;
}
