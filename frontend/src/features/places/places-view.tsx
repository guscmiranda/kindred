
"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/services/api";

import {
    getPlaceCategories,
    getPlaces,
} from "./services";

import type {
    Place,
    PlaceCategory,
} from "./types";

export function PlacesView() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [categories, setCategories] = useState<PlaceCategory[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await getPlaceCategories();
                setCategories(response);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar as categorias.");
                }
            }
        }

        loadCategories();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getPlaces({
                    name: search.trim() || undefined,
                    category: selectedCategory || undefined,
                });

                setPlaces(response.items);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar os lugares.");
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory]);

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Explorar lugares
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Descubra estabelecimentos e encontre lugares
                        que combinam com seus interesses.
                    </p>
                </header>

                <section className="mb-8 flex flex-col gap-4 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Buscar lugar pelo nome..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-purple-500 sm:flex-1"
                    />

                    <select
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-purple-500 sm:w-64"
                    >
                        <option value="">Todas as categorias</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </section>

                {loading && (
                    <p className="text-gray-600">
                        Carregando lugares...
                    </p>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <section className="mb-8">
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">
                                Categorias
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Lugares disponíveis
                                </h2>

                                <span className="text-sm text-gray-500">
                                    {places.length} lugares
                                </span>
                            </div>

                            {places.length === 0 ? (
                                <p className="rounded-lg bg-white p-6 text-gray-600 shadow-sm">
                                    Nenhum lugar encontrado.
                                </p>
                            ) : (
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {places.map((place) => (
                                        <a
                                            key={place.id}
                                            href={`/places/${place.id}`}
                                            className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
                                        >
                                            <article
                                                key={place.id}
                                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {place.name}
                                                </h3>

                                                <p className="mt-2 text-sm text-gray-600">
                                                    {place.description ||
                                                        "Nenhuma descrição disponível."}
                                                </p>

                                                <p className="mt-3 text-sm text-gray-500">
                                                    {place.address}
                                                </p>

                                                {place.categories.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {place.categories.map(
                                                            (category) => (
                                                                <span
                                                                    key={category.id}
                                                                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                                                                >
                                                                    {category.name}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                {place.attributes.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {place.attributes.map(
                                                            (attribute) => (
                                                                <span
                                                                    key={attribute.id}
                                                                    className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-700"
                                                                >
                                                                    {attribute.name}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </article>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
