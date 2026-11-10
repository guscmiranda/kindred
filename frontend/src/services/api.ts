
import { env } from "@/lib/env";

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${env.apiUrl}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.json() as Promise<T>;
}
