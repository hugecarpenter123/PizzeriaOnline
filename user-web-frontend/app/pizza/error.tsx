'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PizzaErrorPage() {
    return (
        // <div className="text-2xl flex items-center justify-center">
        <div className="text-center w-3/4 mx-auto mt-4">
            {/* <span>Some problem occured, please try later and press</span>
            <Link href="./">here</Link>
            <span>to inform us about this inconvenience</span> */}
            <h1 className="text-2xl">
                Some problem occured, please try later and press
                <Link href="./" className="underline font-bold mx-3">here</Link>
                to inform us about this inconvenience</h1>
        </div>
    );
}