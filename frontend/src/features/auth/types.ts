export interface RegisterRequest {
    email: string;
    password: string;
    date_of_birth: string;
    username: string;
    display_name: string;
    bio?: string;
}

export interface RegisterResponse {
    id: string;
    email: string;
    username: string;
    display_name: string;
    bio: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
}

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    display_name: string;
    bio: string | null;
}