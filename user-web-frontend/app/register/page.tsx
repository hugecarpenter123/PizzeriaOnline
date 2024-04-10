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
import useRegister from "@/hooks/useRegister";
import { validationRegex } from "@/lib/utils";

export default function RegisterPage() {
    const { register, loading, error, success } = useRegister();
    const {
        characterOneWord,
        characterMultiWord,
        cityCodeRegex,
        houseNumberRegex,
        polishPhoneNumberRegex,
    } = validationRegex();

    useEffect(() => {
        if (success) {
            redirect("/login");
        }
    }, [success])

    const formSchema = z.object({
        name: z.string().min(1, { message: "Name cannot be empty" }).regex(characterOneWord, "Name cannot contain special characters"),
        surname: z.string().min(1, { message: "Name cannot be empty" }).regex(characterOneWord, "Surname cannot contain special characters"),
        email: z.string().email({ message: "Text must be an email" }),
        password: z.string().min(6, "Password cannot be shorter than 6 characters"),
        repeatPassword: z.string().min(6, "Password cannot be shorter than 6 characters"),
        city: z.string().min(1, { message: "City cannot be empty" }).regex(characterMultiWord, "Invalid city name format"),
        cityCode: z.string().min(1, { message: "Postal code cannot be empty" }).regex(cityCodeRegex, "Valid postal codes are e.g.: 33-230"),
        street: z.string().min(1, { message: "Street cannot be empty" }).regex(characterMultiWord, "Invalid street name format"),
        houseNumber: z.string().regex(houseNumberRegex, "Valid house numbers are: 21; 38a; 23a/4 etc."),
        phoneNumber: z.string().regex(polishPhoneNumberRegex, "Invalid phone format, use spaces or dashes inbetween"),
        dateOfBirth: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
            repeatPassword: "",
            city: "",
            cityCode: "",
            street: "",
            houseNumber: "",
            phoneNumber: "",
            dateOfBirth: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        register(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mx-auto w-3/4 md:w-full px-8 py-3 md:pb-0 md:grid grid-cols-3 gap-y-2 gap-x-[5%]">
                <p className="leading-tight text-sm text-destructive text-center col-span-3">{error}</p>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="col-start-1">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Marcin" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                        <FormItem className="col-start-1">
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                                <Input placeholder="Kwiatkowski" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="col-start-1">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="marcin.kwiatkowski@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="col-start-1">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="repeatPassword"
                    render={({ field }) => (
                        <FormItem className="col-start-1">
                            <FormLabel>Repeat password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem className="col-start-2 row-start-2">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="Sosnowiec" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cityCode"
                    render={({ field }) => (
                        <FormItem className="col-start-2 row-start-3">
                            <FormLabel>Postal code</FormLabel>
                            <FormControl>
                                <Input placeholder="33-230" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem className="col-start-2 row-start-4">
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                                <Input placeholder="Nikczemna" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="houseNumber"
                    render={({ field }) => (
                        <FormItem className="col-start-2 row-start-5">
                            <FormLabel>Street number</FormLabel>
                            <FormControl>
                                <Input placeholder="21/38" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem className="col-start-3 row-start-2">
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="+48 699 588 477" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem className="col-start-3 row-start-3">
                            <FormLabel>Date of birth</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="mt-4 sm:mt-6 sm:self-center sm:px-6 appButton | col-start-2 row-start-7">{!loading ? "Register" : "Loading..."}</Button>
                <p className="text-center text-xs mt-2 | col-span-3 row-start-8">Already have an account?
                    <Link href="/login">
                        <Button variant={"link"} className="h-6 px-2">login here</Button>
                    </Link>
                </p>
                <Link href="/pizza" className="text-center | col-span-3 row-start-9">
                    <Button variant={"link"} className="h-6 px-2 text-xs">Continue without an account</Button>
                </Link>
            </form>
        </Form>
    );
}
