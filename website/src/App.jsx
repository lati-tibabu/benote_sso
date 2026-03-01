import { Navigate, Route, Routes } from "react-router-dom"
import { SiteShell } from "@/components/site-shell"
import { BlogsPage } from "@/pages/blogs-page"
import { ChangelogsPage } from "@/pages/changelogs-page"
import { DocsPage } from "@/pages/docs-page"
import { HelloPage } from "@/pages/hello-page"

function App() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route path="/" element={<HelloPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/changelogs" element={<ChangelogsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/_hello" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
