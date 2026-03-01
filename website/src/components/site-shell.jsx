import { NavLink, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { label: "_hello", to: "/" },
  { label: "docs", to: "/docs" },
  { label: "changelogs", to: "/changelogs" },
  { label: "blogs", to: "/blogs" },
]

export function SiteShell() {
  return (
    <div className="min-h-screen bg-[linear-gradient(120deg,#f8fafc_0%,#eef2ff_45%,#ecfeff_100%)]">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="font-mono text-sm font-semibold tracking-tight">
            benote/sso
          </NavLink>
          <nav className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <Button key={link.to} variant="ghost" size="sm" asChild>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "text-sm",
                      isActive && "bg-muted font-medium text-foreground"
                    )
                  }
                  end={link.to === "/"}
                >
                  {link.label}
                </NavLink>
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
