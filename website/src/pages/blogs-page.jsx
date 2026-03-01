import { ExternalLink, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { blogItems } from "@/data/site-content"

export function BlogsPage() {
  return (
    <section>
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5" />
        <h1 className="text-3xl font-semibold tracking-tight">blogs</h1>
      </div>
      <p className="mt-2 text-muted-foreground">Patterns and implementation notes for secure cross-app authentication.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {blogItems.map((post) => (
          <Card key={post.title}>
            <CardHeader>
              <CardTitle className="text-base">{post.title}</CardTitle>
              <CardDescription>{post.readTime}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{post.summary}</p>
              <Button variant="outline" size="sm" className="w-full justify-between">
                Read post <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
