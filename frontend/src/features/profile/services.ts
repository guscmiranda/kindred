import { apiFetch } from "@/services/api";
import type { Profile } from "./types";

export function getMyProfile(): Promise<Profile> {
    return apiFetch<Profile>("/profiles/me");
}