
import { apiFetch } from "@/services/api";
import type {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    AuthUser,
} from "./types";

export function registerUser(
    data: RegisterRequest
): Promise<RegisterResponse> {
    return apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function loginUser(
    data: LoginRequest
): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function logoutUser(): Promise<{ message: string }> {
    return apiFetch<{ message: string }>("/auth/logout", {
        method: "POST",
    });
}

export function getCurrentUser(): Promise<AuthUser> {
    return apiFetch<AuthUser>("/auth/me");
}

