import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserIconProps = {
    imgUrl: string,
    className?: string,
    fallbackText?: string,
}

export default function UserIcon({ imgUrl, className, fallbackText }: UserIconProps) {
    return (
        <Avatar className={cn("h-8 w-8", className)}>
            {/* <AvatarImage src={imgUrl} /> */}
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="text-xs">{fallbackText ? fallbackText : "(>^^)>"}</AvatarFallback>
        </Avatar>
    );
}