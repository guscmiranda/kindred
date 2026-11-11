import { GuestGuard } from "@/features/auth/components/guest-guard";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
    return (
        <GuestGuard>
            <main className="flex min-h-screen items-center justify-center p-6">
                <section className="w-full max-w-md">
                    <h1 className="mb-2 text-3xl font-bold">
                        Criar sua conta
                    </h1>

                    <p className="mb-8 text-gray-600">
                        Preencha seus dados para começar a fazer parte do Kindred.
                    </p>

                    <RegisterForm />
                </section>
            </main>
        </GuestGuard>
    );
}
