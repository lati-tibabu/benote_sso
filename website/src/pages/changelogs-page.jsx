import { CalendarClock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { changelogItems } from "@/data/site-content"

export function ChangelogsPage() {
  return (
    <section>
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5" />
        <h1 className="text-3xl font-semibold tracking-tight">changelogs</h1>
      </div>
      <p className="mt-2 text-muted-foreground">Release updates for Benote SSO packages and integration guidance.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {changelogItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardDescription>{item.date}</CardDescription>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
