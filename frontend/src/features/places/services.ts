
import { apiFetch } from "@/services/api";

import type {
    AgentPlace,
    ManagedPlace,
    Place,
    PlaceAttribute,
    PlaceAttributeGroup,
    PlaceCategory,
    PlaceListResponse,
} from "./types";

export interface PlaceFilters {
    name?: string;
    category?: string;
    limit?: number;
    offset?: number;
}

export interface PlaceCreateData {
    name: string;
    description: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    category_ids: string[];
    attribute_ids: string[];
}

export interface PlaceUpdateData {
    name: string;
    description: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    category_ids: string[];
    attribute_ids: string[];
}

export interface PlaceAgentSearchResponse {
    response: string;
    places: AgentPlace[];
    total: number;
}

export function getPlaces(
    filters: PlaceFilters = {}
): Promise<PlaceListResponse> {
    const params = new URLSearchParams();

    if (filters.name) {
        params.set("name", filters.name);
    }

    if (filters.category) {
        params.set("category", filters.category);
    }

    if (filters.limit !== undefined) {
        params.set("limit", String(filters.limit));
    }

    if (filters.offset !== undefined) {
        params.set("offset", String(filters.offset));
    }

    const query = params.toString();
    const endpoint = query ? `/places?${query}` : "/places";

    return apiFetch<PlaceListResponse>(endpoint);
}

export function getManagedPlaces(): Promise<ManagedPlace[]> {
    return apiFetch<ManagedPlace[]>("/places/managed");
}

export function getPlaceCategories(): Promise<PlaceCategory[]> {
    return apiFetch<PlaceCategory[]>("/places/categories");
}

export function getPlaceAttributes(
    group?: PlaceAttributeGroup
): Promise<PlaceAttribute[]> {
    const params = new URLSearchParams();

    if (group) {
        params.set("group", group);
    }

    const query = params.toString();
    const endpoint = query
        ? `/places/attributes?${query}`
        : "/places/attributes";

    return apiFetch<PlaceAttribute[]>(endpoint);
}

export function getPlaceById(placeId: string): Promise<Place> {
    return apiFetch<Place>(`/places/${placeId}`);
}

export function createPlace(data: PlaceCreateData): Promise<Place> {
    return apiFetch<Place>("/places", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function updatePlace(
    placeId: string,
    data: PlaceUpdateData
): Promise<Place> {
    return apiFetch<Place>(`/places/${placeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function deactivatePlace(placeId: string): Promise<Place> {
    return apiFetch<Place>(`/places/${placeId}`, {
        method: "DELETE",
    });
}

export function activatePlace(placeId: string): Promise<Place> {
    return apiFetch<Place>(`/places/${placeId}/activate`, {
        method: "POST",
    });
}

export function searchPlacesWithAgent(
    message: string
): Promise<PlaceAgentSearchResponse> {
    return apiFetch<PlaceAgentSearchResponse>(
        "/agents/places/search",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        }
    );
}