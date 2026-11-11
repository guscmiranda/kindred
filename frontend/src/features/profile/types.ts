export interface Profile {
    id: string;
    username: string;
    display_name: string;
    bio: string | null;
    pfp_url: string | null;
    banner_url: string | null;
    location: string | null;
    visibility: "public" | "private";
}