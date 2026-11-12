
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { ApiError } from "@/services/api";

import {
    getManagedPlaces,
    getPlaceById,
} from "./services";

import type { Place } from "./types";

interface PlaceDetailViewProps {
    placeId: string;
}

export function PlaceDetailView({ placeId }: PlaceDetailViewProps) {
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [canEdit, setCanEdit] = useState(false);
    const searchParams = useSearchParams();
    const fromManaged = searchParams.get("from") === "managed";

    useEffect(() => {
        async function loadPlace() {
            try {
                setLoading(true);
                setError(null);
                setCanEdit(false);

                const [placeResponse, managedPlaces] = await Promise.all([
                    getPlaceById(placeId),
                    getManagedPlaces().catch(() => []),
                ]);

                setPlace(placeResponse);

                const managedPlace = managedPlaces.find(
                    (item) => item.place.id === placeId
                );

                setCanEdit(
                    managedPlace?.role === "owner" ||
                    managedPlace?.role === "admin"
                );
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar os dados do lugar.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadPlace();
    }, [placeId]);

    if (loading) {
        return <p className="p-8">Carregando lugar...</p>;
    }

    if (error || !place) {
        return (
            <main className="p-8">
                <p className="text-red-600">
                    {error || "Lugar não encontrado."}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-6 py-10">
                <Link
                    href={fromManaged ? "/places/managed" : "/places"}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                    ← Voltar para lugares
                </Link>

                <header className="mt-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {place.name}
                        </h1>

                        {canEdit && (
                            <Link
                                href={`/places/${place.id}/edit`}
                                className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
                            >
                                Editar estabelecimento
                            </Link>
                        )}
                    </div>

                    <p className="mt-3 text-gray-600">
                        {place.description || "Nenhuma descrição disponível."}
                    </p>
                </header>

                <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Endereço
                    </h2>

                    <p className="mt-2 text-gray-600">
                        {place.address}
                    </p>

                    {place.latitude !== null && place.longitude !== null && (
                        <p className="mt-2 text-sm text-gray-500">
                            Coordenadas: {place.latitude}, {place.longitude}
                        </p>
                    )}
                </section>

                <section className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Categorias
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {place.categories.length > 0 ? (
                            place.categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                                >
                                    {category.name}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                Nenhuma categoria cadastrada.
                            </p>
                        )}
                    </div>
                </section>

                <section className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Características do ambiente
                    </h2>

                    {place.attributes.length === 0 ? (
                        <p className="mt-3 text-gray-500">
                            Nenhuma característica cadastrada.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-5">
                            {(
                                [
                                    ["ambience", "Ambiente"],
                                    ["activities", "Atividades"],
                                    ["music", "Música"],
                                    ["audience", "Público"],
                                ] as const
                            ).map(([group, title]) => {
                                const attributes = place.attributes.filter(
                                    (attribute) => attribute.group === group
                                );

                                if (attributes.length === 0) return null;

                                return (
                                    <div key={group}>
                                        <h3 className="text-sm font-medium text-gray-700">
                                            {title}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {attributes.map((attribute) => (
                                                <span
                                                    key={attribute.id}
                                                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                                                >
                                                    {attribute.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
