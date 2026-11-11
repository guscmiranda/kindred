
export type InterestLevel = 1 | 2 | 3 | 4 | 5;

export interface InterestCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface Interest {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categories: InterestCategory[];
}

export interface UserInterest {
    interest: Interest;
    interest_level: InterestLevel;
    is_highlighted: boolean;
    created_at: string;
}

export interface UserInterestCreateRequest {
    interest_id: string;
    interest_level: InterestLevel;
    is_highlighted?: boolean;
}

export interface UserInterestUpdateRequest {
    interest_level?: InterestLevel;
    is_highlighted?: boolean;
}
