import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="px-5 md:px-8 pt-6 md:pt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}
