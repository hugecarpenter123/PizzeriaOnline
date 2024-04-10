'use client'
import { AppContext } from '@/contexts/app-context';
import { useContext } from 'react'
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'

const useForceLogout = () => {
    const { logout } = useContext(AppContext);
    const router = useRouter();

    const navigateToLoginPage = () => {
        router.replace("/");
    }

    const forceLogout = () => {
        logout()
        redirect("/");
    }

    return forceLogout
}

export default useForceLogout;