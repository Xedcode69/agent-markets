import {InputOTPForm} from '../../components/auth/otp-form'

export default function VerifyOtp(){
    return(
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-12">
            <InputOTPForm />
        </main>
    )
}