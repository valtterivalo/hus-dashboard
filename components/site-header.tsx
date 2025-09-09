import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <h1 className="text-base font-medium">HUS Terveysindikaattorit</h1>
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="ml-auto" />
      </div>
    </header>
  )
}
