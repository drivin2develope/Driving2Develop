import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="px-5 md:px-8 pt-6 md:pt-8 space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
