import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";

export default function Notfound() {
    return (
        <div className="mt-10">
            <h1 className="font-bold text-2xl sm:text-3xl mb-4 text-center">Hey buddy, page doesn't exist, but who knows?</h1>
            <div className="flex gap-3 justify-center items-center">
                <p>you can go back on earth here</p>
                <Link href={"/"}>
                    <Button className="appButton px-2 h-8 sm:h-10 sm:px-4 ">Back on earth</Button>
                </Link>
            </div>
        </div>
    );
}