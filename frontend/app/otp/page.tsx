import {InputOTPForm} from '../../components/auth/otp-form'
import type { UserRole } from "@/lib/auth"

type VerifyOtpProps = {
    searchParams: Promise<{
        userId?: string
        email?: string
        role?: UserRole
    }>
}

export default async function VerifyOtp({ searchParams }: VerifyOtpProps){
    const params = await searchParams

    return(
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-12">
            <InputOTPForm
                userId={params.userId}
                email={params.email}
                role={params.role}
            />
        </main>
    )
}
