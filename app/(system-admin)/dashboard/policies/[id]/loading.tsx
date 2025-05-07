export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
      <div className="h-[600px] bg-muted animate-pulse rounded-md" />
    </div>
  )
}
