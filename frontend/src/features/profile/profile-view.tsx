
"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { getMyProfile } from "./services";
import type { Profile } from "./types";

export function ProfileView() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getMyProfile();
                setProfile(data);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar seu perfil.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    if (loading) {
        return <p>Carregando perfil...</p>;
    }

    if (error) {
        return (
            <p role="alert" className="text-red-600">
                {error}
            </p>
        );
    }

    if (!profile) {
        return <p>Perfil não encontrado.</p>;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-6 py-10">
                <div
                    className="h-48 rounded-xl bg-purple-200 bg-cover bg-center"
                    style={{
                        backgroundImage: profile.banner_url
                            ? `url("${profile.banner_url}")`
                            : undefined,
                    }}
                />

                <section className="relative -mt-12 px-6">
                    <div
                        className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-purple-600 bg-cover bg-center text-3xl font-bold text-white"
                        style={{
                            backgroundImage: profile.pfp_url
                                ? `url("${profile.pfp_url}")`
                                : undefined,
                        }}
                    >
                        {!profile.pfp_url &&
                            profile.display_name.charAt(0).toUpperCase()}
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {profile.display_name}
                            </h1>

                            <p className="text-gray-500">
                                @{profile.username}
                            </p>
                        </div>

                        <LogoutButton />
                    </div>

                    {profile.bio && (
                        <p className="mt-4 text-gray-700">
                            {profile.bio}
                        </p>
                    )}

                    {profile.location && (
                        <p className="mt-3 text-sm text-gray-500">
                            {profile.location}
                        </p>
                    )}

                    {/* <p className="mt-4 text-sm text-gray-500">
                        Visibilidade: {profile.visibility === "public"
                            ? "Público"
                            : "Privado"}
                    </p> */}
                </section>
            </div>
        </main>
    );
}
