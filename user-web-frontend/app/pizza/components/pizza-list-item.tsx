import { Pizza } from "@/lib/types";
import React, { memo, useState } from "react";
import PizzaPage from "../page";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner"

type Props = {
    pizza: Pizza,
    addToCart: (pizzaId: number, size: number) => void,
}

const PizzaItem = ({ pizza, addToCart }: Props) => {
    console.log(`PizzaItem -${pizza.id}- render`);

    const [selectedPriceIndex, setSelectedPriceIndex] = useState(1);
    const [count, setCount] = useState(1);
    const onPizzaDetailsPress = (pizzaId: number) => {
        // todo: implement
    }

    const pizzaPrices = [pizza.smallSizePrice, pizza.mediumSizePrice, pizza.bigSizePrice]
    const pizzaSizes = ["Mała", "Średnia", "Duża"]

    const handleCountChange = (val: number) => {
        if (count + val <= 0) {
            return
        }
        setCount((prev) => prev + val);
    }

    const onAddToCartClicked = () => {
        console.log("should happen toeast")
        toast(`${pizza.name} - ${pizzaSizes[selectedPriceIndex]} - added to cart`, {
            description: new Date().toDateString(),
            action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
            },
        })
    }


    return (
        // <div className="flex border rounded border-primary px-4 items-center">
        //     {/* <div className="h-[150px] w-[150px] relative flex justify-center items-center shrink-0  ">
        //         <Image
        //             src={pizza.imageUrl}
        //             alt={pizza.name}
        //             quality={100}
        //             placeholder="blur"
        //             blurDataURL='@/public/blur-pizza-img.avif'
        //             width={130}
        //             height={130}
        //             className="rounded h-[130px] w-[130px] object-cover"
        //         />
        //     </div> */}
        //     <Image
        //         src={pizza.imageUrl}
        //         alt={pizza.name}
        //         quality={100}
        //         placeholder="blur"
        //         blurDataURL='@/public/blur-pizza-img.avif'
        //         width={130}
        //         height={130}
        //         className="rounded h-[130px] w-[130px] object-cover my-4"
        //     />
        //     <div className="ml-6 overflow-visible md:w-[160px] lg:w-auto">
        //         <div className="text-nowrap">
        //             <h4 className="mb-2 font-bold inline-block">{pizza.name}</h4>
        //             <Link href={`/pizza/${pizza.id}`} className="ml-2">
        //                 <Button variant={"outline"} size={'sm'} className="text-muted-foreground p-2 h-7">details</Button>
        //             </Link>
        //         </div>
        //         <p className="text-sm text-muted-foreground w-auto md:w-[150px] lg:w-[350px]">{pizza.ingredients.join(", ")}</p>
        //     </div>
        //     <div className="inline-flex gap-3 ml-4 mt-3">
        //         {
        //             Array.from({ length: 3 }).map((_, index) => (
        //                 <div key={index} className="text-center text-xs lg:text-sm">
        //                     <p>{pizzaPrices[index]} zł</p>
        //                     <div
        //                         className={cn("appButton rounded-xl px-4 py-1 cursor-pointer mt-1 shadow-md", index === selectedPriceIndex && "outline outline-2 outline-red-600 dark:outline-primary")}
        //                         onClick={() => setSelectedPriceIndex(index)}
        //                     >
        //                         {pizzaSizes[index]}
        //                     </div>
        //                 </div>
        //             ))
        //         }
        //     </div>
        //     <div className="flex-1 flex justify-end items-center">
        //         <div className="flex flex-col xl:flex-row gap-2">
        //             <div className="flex gap-2 items-center justify-center">
        //                 <Button className="lg:h-8 lg:w-8 h-7 w-7" variant={"outline"} size={"sm"} onClick={() => handleCountChange(-1)} >-</Button>
        //                 <span>{count}</span>
        //                 <Button className="lg:h-8 lg:w-8 h-7 w-7" variant={"outline"} size={"sm"} onClick={() => handleCountChange(1)}>+</Button>
        //             </div>
        //             <Button className="text-xs">
        //                 <Icons.cart className="h-3 w-3 mr-2 inline-block" />
        //                 <div className="text-nowrap">{(pizzaPrices[selectedPriceIndex] * count).toFixed(2)} zł</div>
        //             </Button>
        //         </div>
        //     </div>
        // </div>
        // <div className="flex border rounded border-primary p-4 items-center md:flex-row flex-col bg-slate-300">
        //     <div className="flex w-full md:flex-grow-0 items-center bg-red-300">
        //     {/* <div className="flex md:flex-grow-0 items-center"> */}
        //         <Image
        //             src={pizza.imageUrl}
        //             alt={pizza.name}
        //             quality={100}
        //             placeholder="blur"
        //             blurDataURL='@/public/blur-pizza-img.avif'
        //             width={130}
        //             height={130}
        //             className="rounded h-[130px] w-[130px] object-cover"
        //         />
        //         <div className="ml-6 overflow-visible bg-slate-400 md:w-[160px] lg:w-auto">
        //             <div className="text-nowrap">
        //                 <h4 className="mb-2 font-bold inline-block">{pizza.name}</h4>
        //                 <Link href={`/pizza/${pizza.id}`} className="ml-2">
        //                     <Button variant={"outline"} size={'sm'} className="text-muted-foreground p-2 h-7">details</Button>
        //                 </Link>
        //             </div>
        //             <p className="text-sm text-muted-foreground w-auto md:w-[150px] lg:w-[350px]">{pizza.ingredients.join(", ")}</p>
        //         </div>
        //     </div>
        //     <div className="flex justify-between flex-1 md:flex-row flex-col items-center gap-5">
        //         <div className="inline-flex gap-3 ml-4 mt-3 md:mt-0">
        //             {
        //                 Array.from({ length: 3 }).map((_, index) => (
        //                     <div key={index} className="text-center text-xs lg:text-sm">
        //                         <p>{pizzaPrices[index]} zł</p>
        //                         <div
        //                             className={cn("appButton rounded-xl px-4 py-1 cursor-pointer mt-1 shadow-md", index === selectedPriceIndex && "outline outline-2 outline-red-600 dark:outline-primary")}
        //                             onClick={() => setSelectedPriceIndex(index)}
        //                         >
        //                             {pizzaSizes[index]}
        //                         </div>
        //                     </div>
        //                 ))
        //             }
        //         </div>
        //         <div className="flex-1 flex justify-end items-center">
        //             <div className="flex flex-row md:flex-col xl:flex-row gap-2">
        //                 <div className="flex gap-2 items-center justify-center">
        //                     <Button className="lg:h-8 lg:w-8 h-7 w-7" variant={"outline"} size={"sm"} onClick={() => handleCountChange(-1)} >-</Button>
        //                     <span>{count}</span>
        //                     <Button className="lg:h-8 lg:w-8 h-7 w-7" variant={"outline"} size={"sm"} onClick={() => handleCountChange(1)}>+</Button>
        //                 </div>
        //                 <Button className="text-xs">
        //                     <Icons.cart className="h-3 w-3 mr-2 inline-block" />
        //                     <div className="text-nowrap">{(pizzaPrices[selectedPriceIndex] * count).toFixed(2)} zł</div>
        //                 </Button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="flex border rounded border-primary p-4 items-center md:flex-row flex-col relative max-w-[450px] md:min-w-full mx-auto">
            <Link href={`/pizza/${pizza.id}`} className="ml-2 absolute top-3 right-3 md:hidden">
                <Button variant={"outline"} size={'sm'} className="text-muted-foreground p-2 h-7">details</Button>
            </Link>
            <div className="flex flex-1 w-full md:w-auto items-center">
                <Image
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    quality={100}
                    placeholder="blur"
                    blurDataURL='@/public/blur-pizza-img.avif'
                    width={130}
                    height={130}
                    className="rounded h-[130px] w-[130px] object-cover"
                />
                <div className="ml-6">
                    <div className="relative w-fit">
                        <h4 className="mb-2 font-bold inline-block">{pizza.name}</h4>
                        <Link href={`/pizza/${pizza.id}`} className="ml-2 absolute top-0 -right-20 hidden md:block ">
                            <Button variant={"outline"} size={'sm'} className="text-muted-foreground p-2 h-7">details</Button>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">{pizza.ingredients.join(", ")}</p>
                </div>
            </div>
            <div className="flex justify-between flex-1 md:flex-row flex-col items-center gap-5">
                <div className="inline-flex gap-3 ml-4 pt-6 lg:pt-0">
                    {
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="text-center text-xs lg:text-sm">
                                <p>{pizzaPrices[index]} zł</p>
                                <div
                                    className={cn("appButton rounded-xl px-4 py-1 cursor-pointer mt-1 shadow-md", index === selectedPriceIndex && "outline outline-2 outline-red-600 dark:outline-primary")}
                                    onClick={() => setSelectedPriceIndex(index)}
                                >
                                    {pizzaSizes[index]}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex-1 flex justify-end items-center">
                    <div className="flex flex-row md:flex-col xl:flex-row gap-2">
                        <div className="flex gap-2 items-center justify-center">
                            <Button className="lg:h-8 lg:w-8 h-7 w-7" variant={"outline"} size={"sm"} onClick={() => handleCountChange(-1)} >-</Button>
                            <span>{count}</span>
                            <Button className="lg:h-8 lg:w-8 h-7 w-7" variant={"outline"} size={"sm"} onClick={() => handleCountChange(1)}>+</Button>
                        </div>
                        <Button className="text-xs" onClick={onAddToCartClicked}>
                            <Icons.cart className="h-3 w-3 mr-2 inline-block" />
                            <div className="text-nowrap">{(pizzaPrices[selectedPriceIndex] * count).toFixed(2)} zł</div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default memo(PizzaItem);