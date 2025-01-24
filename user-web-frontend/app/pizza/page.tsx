'use client'

import { AppContext } from "@/contexts/app-context";
import useFetchMenu from "@/hooks/useFetchMenu";
import { useContext, useEffect } from "react";
import PizzaListItem from "./components/pizza-list-item";
import PizzaErrorPage from "./error";

export default function PizzaPage() {
    const { menu } = useContext(AppContext);
    const { fetchMenu, loading, error } = useFetchMenu(false);
    useEffect(() => {
        if (!menu) {
            fetchMenu();
        }
    }, [])


    return (
        <main className="p-3">
            {loading && !menu ? (
                <div className="text-center">
                    Loading...
                </div>
            ) : error ? (
                <PizzaErrorPage />
            ) : (
                <div className="mx-auto p-4 space-y-3">
                    {/* {menu && <PizzaListItem pizza={menu!.pizzaList[0]} addToCart={() => { }} />} */}
                    {menu && menu.pizzaList.map((pizzaItem, index) =>
                        <PizzaListItem key={index} pizza={pizzaItem} addToCart={() => { }} />
                    )}
                </div>
            )}
        </main>
    );
}
