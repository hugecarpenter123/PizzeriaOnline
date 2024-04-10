export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "PizzeriaOnline",
  description:
    "Pizzeria web application for staff.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Pizza",
      href: "/pizza",
    },
    {
      title: "Drinks",
      href: "/drink",
    },
  ],
}
