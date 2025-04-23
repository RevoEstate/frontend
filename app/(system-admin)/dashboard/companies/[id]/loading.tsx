export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/3">
          <div className="h-[500px] bg-muted animate-pulse rounded-md" />
        </div>
        <div className="w-full md:w-2/3">
          <div className="h-[500px] bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  )
}
