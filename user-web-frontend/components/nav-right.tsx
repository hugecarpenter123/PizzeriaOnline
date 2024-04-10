import Link from "next/link";
import { Icons } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserIcon from "./user-icon";
import { useContext } from "react";
import { AppContext } from "@/contexts/app-context";

type Props = {
    token: string | null,
    logout: () => void,
    className?: string
}

function NavRight({ className }: Props) {
    const { token, logout, userDetails } = useContext(AppContext);
    return (
        <div className={cn("flex items-center justify-end", className)}>
            <nav className="flex items-center gap-1 sm:gap-3">
                <Link href={"/cart"}>
                    <Button variant="ghost" size="icon">
                        <Icons.cart className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                </Link>
                {token
                    ? (
                        <Link href="/user">
                            <UserIcon
                                imgUrl={userDetails!.imageUrl}
                                fallbackText={`${userDetails!.name[0]}${userDetails!.surname[1]}`.toUpperCase()}
                            />
                        </Link>
                    )
                    : (
                        <>
                            <Link href="/login">
                                <Button className="hidden sm:block h-9" >Login</Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="sm:hidden">
                                <Icons.login className="h-5 w-5" />
                            </Button>
                        </>
                    )}
                <ThemeToggle />
            </nav>
        </div>
    );
}

export default NavRight;