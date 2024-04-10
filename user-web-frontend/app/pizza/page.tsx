'use client'

import { AppContext } from "@/contexts/app-context";
import useFetchMenu from "@/hooks/useFetchMenu";
import { useContext, useEffect } from "react";

export default function PizzaPage() {
    const { menu } = useContext(AppContext);
    const { fetchMenu, loading, error } = useFetchMenu(false);
    useEffect(() => {
        if (!menu) {
            fetchMenu();
        }
    }, [])

    return (
        <main className="bg-red-200 p-3">
            {loading && !menu ? (
                <div className="text-center">
                    Loading...
                </div>
            ) : (
                <div>
                    {JSON.stringify(menu)}
                </div>
            )}
        </main>
    );
}