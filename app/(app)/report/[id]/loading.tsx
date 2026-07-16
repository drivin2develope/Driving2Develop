import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="px-5 md:px-8 pt-6 md:pt-8 space-y-6">
      <Skeleton className="h-8 w-72" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
