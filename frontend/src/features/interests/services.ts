
import { apiFetch } from "@/services/api";
import type {
    Interest,
    InterestCategory,
    UserInterest,
    UserInterestCreateRequest,
    UserInterestUpdateRequest,
} from "./types";

// Consulta todas as categorias disponíveis.
export function getInterestCategories(): Promise<InterestCategory[]> {
    return apiFetch<InterestCategory[]>("/interests/categories");
}

// Consulta os interesses disponíveis.
// A categoria é opcional e permite filtrar o catálogo.
export function getInterests(categorySlug?: string): Promise<Interest[]> {
    const query = categorySlug
        ? `?category_slug=${encodeURIComponent(categorySlug)}`
        : "";

    return apiFetch<Interest[]>(`/interests${query}`);
}

// Consulta os interesses associados ao usuário autenticado.
export function getMyInterests(): Promise<UserInterest[]> {
    return apiFetch<UserInterest[]>("/interests/me");
}

// Adiciona um interesse ao perfil do usuário.
export function addMyInterest(
    data: UserInterestCreateRequest
): Promise<UserInterest> {
    return apiFetch<UserInterest>("/interests/me", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

// Atualiza o nível ou o destaque de um interesse.
export function updateMyInterest(
    interestId: string,
    data: UserInterestUpdateRequest
): Promise<UserInterest> {
    return apiFetch<UserInterest>(
        `/interests/me/${interestId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
}

// Remove um interesse do perfil do usuário.
export function removeMyInterest(interestId: string): Promise<void> {
    return apiFetch<void>(`/interests/me/${interestId}`, {
        method: "DELETE",
    });
}
