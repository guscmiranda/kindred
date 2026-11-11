
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-context";

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Verificando autenticação...</p>
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p role="alert" className="text-red-600">
                    Não foi possível verificar sua sessão. Tente novamente.
                </p>
            </main>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return <>{children}</>;
}
