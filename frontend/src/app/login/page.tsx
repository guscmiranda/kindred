import { LoginForm } from "@/features/auth/login-form";
import { GuestGuard } from "@/features/auth/components/guest-guard";

export default function LoginPage() {
    return (
        <GuestGuard>
            <main className="flex min-h-screen items-center justify-center p-6">
                <section className="w-full max-w-md">
                    <h1 className="mb-2 text-3xl font-bold">
                        Bem-vindo de volta!
                    </h1>
                    <p className="mb-8 text-gray-600">
                        Entre na sua conta para continuar no Kindred.
                    </p>
                    <LoginForm />
                </section>
            </main>
        </GuestGuard>
    );
}