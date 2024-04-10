'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useLogin from "@/hooks/useLogin";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const { loginRequest, loading, error, success } = useLogin();

    useEffect(() => {
        if (success) {
            redirect("/");
        }
    }, [success])

    const formSchema = z.object({
        email: z.string().email({ message: "Text must be an email" }),
        password: z.string().min(4, { message: "Password cannot be shorter than 4 characters" }).max(50),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        loginRequest(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/5 lg:w-5/12 md:w-1/2 mx-auto mt-20 flex flex-col gap-2">
                <p className="leading-tight text-sm text-destructive text-center h-5">{error}</p>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="mt-4 sm:mt-6 sm:self-center sm:px-6 appButton">{!loading ? "Submit" : "Loading..."}</Button>
                <p className="text-center text-xs mt-2">Don't have an account?
                    <Link href="/register">
                        <Button variant={"link"} className="h-6 px-2">register here</Button>
                    </Link>
                </p>
                <Link href="/pizza" className="text-center">
                    <Button variant={"link"} className="h-6 px-2 text-xs">Continue without an account</Button>
                </Link>
            </form>
        </Form>
    );
}
