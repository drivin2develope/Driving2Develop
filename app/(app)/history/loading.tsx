import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="px-5 md:px-8 pt-6 md:pt-8 space-y-3">
      <Skeleton className="h-8 w-48 mb-4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
