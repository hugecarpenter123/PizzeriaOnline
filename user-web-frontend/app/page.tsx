'use client'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useContext, useEffect } from "react"
import { AppContext } from "@/contexts/app-context"
import { Icons } from "@/components/icons"
import UserIcon from "@/components/user-icon"
import useFetchMenu from "@/hooks/useFetchMenu"

export default function IndexPage() {
  const { token, userDetails, logout, setMenu } = useContext(AppContext);
  const { fetchMenu } = useFetchMenu(true);

  return (
    <section className="flex flex-col items-center pt-10 gap-2 px-1">
      {token
        ? (<>
          <div className="text-2xl sm:text-3xl mb-2 text-center space-x-3">
            <span>Hello</span>
            <span className="font-bold">{userDetails?.name}</span>
          </div>
          <ul className="space-y-2 list-disc">
            <li className="text-center flex items-center">
              <span className="inline-block">make your order</span>
              <Link href={"/pizza"} className="mx-4">
                <Button size={"sm"} variant={"outline"}>menu</Button>
              </Link>
            </li>
            <li className="text-center flex items-center">
              <span>visit your cart</span>
              <Link href={"/cart"} className="mx-4">
                <Button size={"sm"} variant={"outline"}>{<Icons.cart />}</Button>
              </Link>
            </li>
            <li className="text-center flex items-center">
              <span>view your account</span>
              <Link href={"/user"} className="mx-4">
                <UserIcon
                  imgUrl={userDetails!.imageUrl}
                  fallbackText={`${userDetails!.name[0]}${userDetails!.surname[1]}`.toUpperCase()}
                />
              </Link>
            </li>
            <li className="text-center flex items-center">
              <span>or</span>
              <Button size={"sm"} onClick={logout} className="mx-4">Logout</Button>
            </li>
          </ul>
        </>)
        : (<>
          <h1 className="font-bold text-2xl sm:text-3xl mb-2 text-center">Order your favourite pizza and eat!</h1>
          <p className="text-center">
            Register
            <Link href={"/register"} className="mx-2">
              <Button variant={"outline"} size={"sm"}>Here</Button>
            </Link>
            and order
          </p>
          <div className="text-center">
            <p className="mb-2 inline-block">or order without an account</p>
            <Link href={"/pizza"} className="mx-4">
              <Button size={"sm"} className="appButton">go to menu</Button>
            </Link>
          </div>
        </>)}
    </section>
  )
}
