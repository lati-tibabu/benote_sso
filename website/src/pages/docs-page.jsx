import { BookOpen } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"

export function DocsPage() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h1 className="text-3xl font-semibold tracking-tight">docs</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Package usage for issuer backend, handoff frontend, and consumer callback.
        </p>

        <Tabs defaultValue="install" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="install">Install</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="external">External App</TabsTrigger>
          </TabsList>

          <TabsContent value="install" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Install Packages</CardTitle>
                <CardDescription>Add both packages depending on your app layer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock>{`# backend (issuer)
npm install @benote/sso-backend

# frontend (handoff trigger)
npm install @benote/sso-frontend`}</CodeBlock>
                <CodeBlock>{`# required env vars
SSO_SHARED_SECRET=your_very_strong_secret
SSO_ISSUER=your-app-name
SSO_AUDIENCE=external-platform
SSO_TARGET_BASE_URL=https://external.example.com
SSO_TOKEN_TTL_SECONDS=300`}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Backend Token Issuer</CardTitle>
                <CardDescription>Create config and token endpoints in your authenticated API.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock>{`import { generateToken } from "@benote/sso-backend";

app.get("/api/auth/sso/config", (req, res) => {
  res.json({ targetBaseUrl: process.env.SSO_TARGET_BASE_URL });
});

app.post("/api/auth/sso/token", (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const token = generateToken(
    { id: user.id, email: user.email, name: user.name, roles: user.roles || [] },
    user.roles || [],
    process.env.SSO_AUDIENCE,
    process.env.SSO_SHARED_SECRET,
    process.env.SSO_ISSUER,
    { expiresIn: \`\${process.env.SSO_TOKEN_TTL_SECONDS || 300}s\` }
  );

  res.json({ token });
});`}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frontend" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Frontend Handoff Trigger</CardTitle>
                <CardDescription>Fetch target URL, then call triggerSSO with allowed origins.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock>{`import { triggerSSO } from "@benote/sso-frontend";

async function startSSO() {
  const authToken = localStorage.getItem("access_token");
  if (!authToken) throw new Error("Missing auth token");

  const configRes = await fetch("/api/auth/sso/config", {
    headers: { Authorization: \`Bearer \${authToken}\` },
  });
  const { targetBaseUrl } = await configRes.json();

  await triggerSSO("/api/auth/sso/token", targetBaseUrl, authToken, {
    allowedTargetOrigins: [new URL(targetBaseUrl).origin],
    timeoutMs: 15000,
  });
}`}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="external" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>External App Callback</CardTitle>
                <CardDescription>Validate the incoming access_token then create a local session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Accept form POST at <code>/auth/sso/callback</code>.</li>
                  <li>Read <code>access_token</code> from form body.</li>
                  <li>Verify HS256 signature with shared secret.</li>
                  <li>Validate <code>aud</code>, <code>iss</code>, <code>exp</code>.</li>
                  <li>Use <code>sub/email/name/roles/access_rights</code> for account mapping.</li>
                </ul>
                <CodeBlock>{`# pseudocode
token = request.form["access_token"]
claims = verify_jwt_hs256(
  token,
  secret=SSO_SHARED_SECRET,
  audience=SSO_AUDIENCE,
  issuer=SSO_ISSUER
)
login_user(sub=claims["sub"], email=claims["email"])`}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Troubleshooting</h2>
        <Accordion type="single" collapsible className="mt-3 rounded-xl border bg-background px-4">
          <AccordionItem value="token-invalid">
            <AccordionTrigger>Token rejected by external app</AccordionTrigger>
            <AccordionContent>
              Check shared secret, issuer, audience, and server clock skew. Ensure callback app verifies HS256.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="post-failed">
            <AccordionTrigger>Handoff POST failed</AccordionTrigger>
            <AccordionContent>
              Confirm <code>allowedTargetOrigins</code> includes the target origin and callback URL is{" "}
              <code>/auth/sso/callback</code>.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="no-token">
            <AccordionTrigger>No token from backend</AccordionTrigger>
            <AccordionContent>
              Verify auth middleware attaches <code>req.user</code> and your frontend sends a valid Bearer token.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="rounded-2xl border bg-background p-6">
        <h3 className="text-lg font-semibold">Production Checklist</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Rotate shared secret periodically.</li>
          <li>Use HTTPS only.</li>
          <li>Keep token TTL short (300s default).</li>
          <li>Never log raw tokens.</li>
          <li>Coordinate issuer/audience changes with partner teams.</li>
        </ul>
      </section>
    </div>
  )
}
