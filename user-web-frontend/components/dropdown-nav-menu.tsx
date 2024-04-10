import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";
import React from "react";


interface DropdownNavMenuProps {
    items?: NavItem[],
    className?: string,
}

export default function DropdownNavMenu({ items, className }: DropdownNavMenuProps) {

    const ListItem = React.forwardRef<
        React.ElementRef<"a">,
        React.ComponentPropsWithoutRef<"a">
    >(({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild >
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        {/* <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p> */}
                    </a>
                </NavigationMenuLink>
            </li>
        )
    })
    ListItem.displayName = "ListItem"

    return (
        <NavigationMenu className={cn("", className)}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-2 md:w-[400px]">
                            {/* <ListItem href="/" title="home" />
                            <ListItem href="/pizza" title="Pizza" />
                            <ListItem href="/drink" title="Drink" /> */}
                            {items?.map(
                                (item, index) =>
                                    item.href && (
                                        <ListItem title={item.title} href={item.href} key={index} />
                                    )
                            )}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
