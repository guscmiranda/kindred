
export type PlaceAttributeGroup =
    | "ambience"
    | "activities"
    | "music"
    | "audience";

export interface PlaceCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface PlaceAttribute {
    id: string;
    name: string;
    slug: string;
    group: PlaceAttributeGroup;
    description: string | null;
}

export interface Place {
    id: string;
    name: string;
    description: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    categories: PlaceCategory[];
    attributes: PlaceAttribute[];
}

export interface PlaceListResponse {
    items: Place[];
    total: number;
    limit: number;
    offset: number;
}

export interface ManagedPlace {
    place: Place;
    role: "owner" | "admin" | "editor";
}