
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { AuthGuard } from "@/features/auth/components/auth-guard";

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

export function AuthenticatedLayout({
    children,
}: AuthenticatedLayoutProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        try {
            await logout();
            router.replace("/login");
        } catch {
            // A sessão não foi encerrada pelo backend.
        }
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#faf9fc]">
                <header className="w-full border-b border-[#e9e5ef] bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                        <Link
                            href="/home"
                            className="text-2xl font-bold tracking-tight text-[#7656d6]"
                        >
                            kindred<span className="text-[#201c2b]">.</span>
                        </Link>

                        <nav className="flex items-center gap-5">
                            <Link
                                href="/home"
                                className="text-sm font-medium text-[#777181] transition hover:text-[#7656d6]"
                            >
                                Home
                            </Link>

                            <Link
                                href="/profile"
                                className="text-sm font-medium text-[#777181] transition hover:text-[#7656d6]"
                            >
                                Perfil
                            </Link>

                            <Link
                                href="/places"
                                className="text-sm font-medium text-[#777181] transition hover:text-[#7656d6]"
                            >
                                Lugares
                            </Link>

                            <Link
                                href="/interests"
                                className="text-sm font-medium text-[#777181] transition hover:text-[#7656d6]"
                            >
                                Interesses
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <span className="hidden text-sm text-[#777181] sm:block">
                                Olá, {user?.display_name}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-[#7656d6] transition hover:text-[#6243c0]"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
