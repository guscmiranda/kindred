
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../auth-context";

export function LogoutButton() {
    const { logout } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogout() {
        setLoading(true);
        setError(null);

        try {
            await logout();
            router.replace("/login");
        } catch {
            setError("Não foi possível realizar o logout. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
            >
                {loading ? "Saindo..." : "Sair"}
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    );
}
