
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { ApiError } from "@/services/api";
import { getCurrentUser, logoutUser } from "./services";
import type { AuthUser } from "./types";

type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "error";

interface AuthContextValue {
    user: AuthUser | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>("loading");

    const logout = useCallback(async () => {
        await logoutUser();

        setUser(null);
        setStatus("unauthenticated");
    }, []);

    const refreshUser = useCallback(async () => {
        setStatus("loading");

        try {
            const currentUser = await getCurrentUser();

            setUser(currentUser);
            setStatus("authenticated");
        } catch (err) {
            setUser(null);

            if (err instanceof ApiError && err.status === 401) {
                setStatus("unauthenticated");
            } else {
                setStatus("error");
            }
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const value: AuthContextValue = {
        user,
        status,
        isAuthenticated: status === "authenticated",
        refreshUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            "useAuth deve ser utilizado dentro de um AuthProvider."
        );
    }

    return context;
}
