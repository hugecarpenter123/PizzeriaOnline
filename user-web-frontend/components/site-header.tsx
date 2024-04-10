"use client"


import { MainNav } from "@/components/main-nav"
import { siteConfig } from "@/config/site"
import { AppContext } from "@/contexts/app-context"
import { useContext } from "react"
import NavRight from "./nav-right"

export function SiteHeader() {

  const { token, logout } = useContext(AppContext);

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="px-4 sm:px-8 flex h-16 items-center justify-between">
        <MainNav items={siteConfig.mainNav} />
        <NavRight token={token} logout={logout} />
      </div>
    </header>
  )
}
