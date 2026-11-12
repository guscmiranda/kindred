
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ApiError } from "@/services/api";

import {
    activatePlace,
    deactivatePlace,
    getManagedPlaces,
} from "./services";
import type { ManagedPlace } from "./types";

export function ManagedPlacesView() {
    const [places, setPlaces] = useState<ManagedPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [updatingPlaceId, setUpdatingPlaceId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPlaces() {
            try {
                setLoading(true);
                setError(null);

                const response = await getManagedPlaces();
                setPlaces(response);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar seus estabelecimentos.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadPlaces();
    }, []);

    async function handleTogglePlace(placeId: string, isActive: boolean) {
        try {
            setUpdatingPlaceId(placeId);
            setActionError(null);

            const updatedPlace = isActive
                ? await deactivatePlace(placeId)
                : await activatePlace(placeId);

            setPlaces((current) =>
                current.map((item) =>
                    item.place.id === placeId
                        ? { ...item, place: updatedPlace }
                        : item
                )
            );
        } catch (err) {
            if (err instanceof ApiError) {
                setActionError(err.message);
            } else {
                setActionError("Não foi possível atualizar o estabelecimento.");
            }
        } finally {
            setUpdatingPlaceId(null);
        }
    }

    if (loading) {
        return <p className="p-8">Carregando seus estabelecimentos...</p>;
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 p-8">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Meus estabelecimentos
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Visualize e gerencie os estabelecimentos associados à sua conta.
                    </p>
                </header>

                {actionError && (
                    <p className="mb-6 text-sm text-red-600">
                        {actionError}
                    </p>
                )}

                {places.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                        <p className="text-gray-600">
                            Você ainda não possui estabelecimentos cadastrados.
                        </p>

                        <Link
                            href="/places/new"
                            className="mt-4 inline-block font-medium text-purple-600 hover:text-purple-800"
                        >
                            Cadastrar estabelecimento
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {places.map(({ place, role }) => (
                            <article
                                key={place.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {place.name}
                                    </h2>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${place.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {place.is_active ? "Ativo" : "Inativo"}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm text-gray-600">
                                    {place.address}
                                </p>

                                <p className="mt-3 text-sm text-gray-500">
                                    Seu papel: {role}
                                </p>

                                <div className="mt-5 flex items-center gap-4">
                                    <Link
                                        href={`/places/${place.id}?from=managed`}
                                        className="text-sm font-medium text-purple-600 hover:text-purple-800"
                                    >
                                        Ver estabelecimento →
                                    </Link>

                                    {(role === "owner" || role === "admin") && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleTogglePlace(
                                                    place.id,
                                                    place.is_active
                                                )
                                            }
                                            disabled={updatingPlaceId === place.id}
                                            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {updatingPlaceId === place.id
                                                ? "Atualizando..."
                                                : place.is_active
                                                    ? "Desativar"
                                                    : "Ativar"}
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
