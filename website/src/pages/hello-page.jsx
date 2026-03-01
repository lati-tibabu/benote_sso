import { ArrowRight, Globe, KeyRound, Server, ShieldCheck, UserCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { flow } from "@/data/site-content"

const flowIcons = [UserCheck, Globe, KeyRound, Server, ArrowRight, ShieldCheck]

export function HelloPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border bg-background p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="font-mono">Benote SSO</Badge>
          <Badge variant="secondary">auth handoff toolkit</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Authenticate external apps with secure JWT handoff
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Benote SSO lets your app issue short-lived tokens and hand users to partner systems through a secure
          callback flow.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/docs">
              Read docs <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/changelogs">Latest changes</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Flow</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flow.map((step, idx) => {
            const Icon = flowIcons[idx]
            return (
              <Card key={step.title}>
                <CardHeader>
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.text}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
