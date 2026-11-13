
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

import { ApiError } from "@/services/api";

import {
    getPlaceCategories,
    getPlaces,
    searchPlacesWithAgent,
} from "./services";

import type {
    AgentPlace,
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

    const [agentMessage, setAgentMessage] = useState("");
    const [agentResponse, setAgentResponse] = useState<string | null>(null);
    const [agentPlaces, setAgentPlaces] = useState<AgentPlace[]>([]);
    const [agentTotal, setAgentTotal] = useState(0);
    const [agentLoading, setAgentLoading] = useState(false);
    const [agentError, setAgentError] = useState<string | null>(null);

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

    async function handleAgentSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const message = agentMessage.trim();

        if (!message) {
            return;
        }

        try {
            setAgentLoading(true);
            setAgentError(null);
            setAgentResponse(null);

            setAgentPlaces([]);
            setAgentTotal(0);

            const result = await searchPlacesWithAgent(message);

            setAgentResponse(result.response);
            setAgentPlaces(result.places);
            setAgentTotal(result.total);
        } catch (err) {
            if (err instanceof ApiError) {
                setAgentError(err.message);
            } else {
                setAgentError("Não foi possível realizar a busca inteligente.");
            }
        } finally {
            setAgentLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Explorar lugares
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Descubra estabelecimentos e encontre lugares
                            que combinam com seus interesses.
                        </p>
                    </div>

                    <Link
                        href="/places/new"
                        className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white transition hover:bg-purple-700"
                    >
                        Cadastrar lugar
                    </Link>
                </header>

                <section className="mb-8 rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Descubra com o Kindred
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Descreva o tipo de lugar que você procura e deixe nosso
                        agente ajudar na descoberta.
                    </p>

                    <form onSubmit={handleAgentSearch} className="mt-4">
                        <textarea
                            value={agentMessage}
                            onChange={(event) => setAgentMessage(event.target.value)}
                            placeholder="Ex.: Quero um lugar tranquilo onde eu possa conversar e ouvir música alternativa."
                            rows={3}
                            maxLength={1000}
                            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-purple-500"
                        />

                        <div className="mt-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={agentLoading || !agentMessage.trim()}
                                className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {agentLoading ? "Buscando..." : "Buscar com IA"}
                            </button>
                        </div>
                    </form>

                    {agentError && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-sm text-red-700">{agentError}</p>
                        </div>
                    )}

                    {agentResponse && (
                        <div className="mt-5 rounded-lg bg-purple-50 p-4">
                            <h3 className="font-semibold text-gray-900">
                                Resultado da busca
                            </h3>

                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                {agentResponse}
                            </p>

                            <div className="mt-5">
                                <h4 className="mb-3 font-semibold text-gray-900">
                                    Estabelecimentos encontrados ({agentTotal})
                                </h4>

                                {agentPlaces.length === 0 ? (
                                    <p className="text-sm text-gray-600">
                                        Nenhum estabelecimento encontrado para sua busca.
                                    </p>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {agentPlaces.map((place) => (
                                            <Link
                                                key={place.id}
                                                href={`/places/${place.id}`}
                                                className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
                                            >
                                                <h5 className="text-lg font-semibold text-gray-900">
                                                    {place.name}
                                                </h5>

                                                <p className="mt-2 text-sm text-gray-600">
                                                    {place.description ||
                                                        "Nenhuma descrição disponível."}
                                                </p>

                                                <p className="mt-3 text-sm text-gray-500">
                                                    {place.address}
                                                </p>

                                                {place.categories.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {place.categories.map((category) => (
                                                            <span
                                                                key={category.slug}
                                                                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                                                            >
                                                                {category.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {place.attributes.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {place.attributes.map((attribute) => (
                                                            <span
                                                                key={`${attribute.group}-${attribute.slug}`}
                                                                className="rounded-full bg-purple-100 px-2.5 py-1 text-xs text-purple-800"
                                                            >
                                                                {attribute.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

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
                                        <Link
                                            key={place.id}
                                            href={`/places/${place.id}`}
                                            className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
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
                                                    {place.categories.map((category) => (
                                                        <span
                                                            key={category.id}
                                                            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                                                        >
                                                            {category.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {place.attributes.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {place.attributes.map((attribute) => (
                                                        <span
                                                            key={attribute.id}
                                                            className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-700"
                                                        >
                                                            {attribute.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </Link>
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
