
"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import {
    addMyInterest,
    getInterestCategories,
    getInterests,
    getMyInterests,
    removeMyInterest,
    updateMyInterest,
} from "./services";
import type {
    Interest,
    InterestCategory,
    UserInterest,
} from "./types";

export function InterestsView() {
    const [categories, setCategories] = useState<InterestCategory[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [myInterests, setMyInterests] = useState<UserInterest[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loadingInterests, setLoadingInterests] = useState(false);

    const [addingInterestId, setAddingInterestId] = useState<string | null>(null);
    const [actionError, setActionError] = useState("");

    const [updatingInterestId, setUpdatingInterestId] = useState<string | null>(null);

    async function handleRemoveInterest(interestId: string) {
        setUpdatingInterestId(interestId);
        setActionError("");

        try {
            await removeMyInterest(interestId);

            setMyInterests((current) =>
                current.filter(
                    (item) => item.interest.id !== interestId
                )
            );
        } catch (err) {
            if (err instanceof ApiError) {
                setActionError(err.message);
            } else {
                setActionError("Não foi possível remover o interesse.");
            }
        } finally {
            setUpdatingInterestId(null);
        }
    }

    async function handleToggleHighlight(item: UserInterest) {
        setUpdatingInterestId(item.interest.id);
        setActionError("");

        try {
            const updatedInterest = await updateMyInterest(
                item.interest.id,
                {
                    is_highlighted: !item.is_highlighted,
                }
            );

            setMyInterests((current) =>
                current.map((currentItem) =>
                    currentItem.interest.id === item.interest.id
                        ? updatedInterest
                        : currentItem
                )
            );
        } catch (err) {
            if (err instanceof ApiError) {
                setActionError(err.message);
            } else {
                setActionError("Não foi possível atualizar o favorito.");
            }
        } finally {
            setUpdatingInterestId(null);
        }
    }

    async function handleAddInterest(interestId: string) {
        setAddingInterestId(interestId);
        setActionError("");

        try {
            const newUserInterest = await addMyInterest({
                interest_id: interestId,
                interest_level: 3,
                is_highlighted: false,
            });

            setMyInterests((current) => [
                newUserInterest,
                ...current,
            ]);
        } catch (err) {
            if (err instanceof ApiError) {
                setActionError(err.message);
            } else {
                setActionError("Não foi possível adicionar o interesse.");
            }
        } finally {
            setAddingInterestId(null);
        }
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [categoriesData, myInterestsData] =
                    await Promise.all([
                        getInterestCategories(),
                        getMyInterests(),
                    ]);

                setCategories(categoriesData);
                setMyInterests(myInterestsData);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar os interesses.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        async function loadInterests() {
            try {
                setLoadingInterests(true);

                const data = await getInterests(selectedCategory ?? undefined);
                setInterests(data);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar o catálogo.");
                }
            } finally {
                setLoadingInterests(false);
            }
        }

        loadInterests();
    }, [selectedCategory]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-10">
                <p className="text-center text-gray-500">
                    Carregando interesses...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-10">
                <p role="alert" className="text-center text-red-600">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <header>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Meus interesses
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Explore assuntos que você gosta e adicione-os
                        ao seu perfil.
                    </p>
                </header>

                {actionError && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {actionError}
                    </p>
                )}

                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Seus interesses ({myInterests.length})
                    </h2>

                    {myInterests.length === 0 ? (
                        <p className="mt-3 text-gray-500">
                            Você ainda não adicionou nenhum interesse.
                        </p>
                    ) : (
                        <div className="mt-4 flex flex-wrap gap-3">
                            {myInterests.map((item) => (
                                <div
                                    key={item.interest.id}
                                    className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3"
                                >
                                    <p className="font-medium text-gray-900">
                                        {item.interest.name}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Nível: {item.interest_level}/5
                                        {item.is_highlighted &&
                                            " · Destaque"}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleHighlight(item)}
                                        disabled={updatingInterestId !== null}
                                        aria-pressed={item.is_highlighted}
                                        className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${item.is_highlighted
                                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {updatingInterestId === item.interest.id
                                            ? "Atualizando..."
                                            : item.is_highlighted
                                                ? "★ Remover dos favoritos"
                                                : "☆ Adicionar aos favoritos"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInterest(item.interest.id)}
                                        disabled={updatingInterestId !== null}
                                        className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {updatingInterestId === item.interest.id
                                            ? "Atualizando..."
                                            : "Remover interesse"}
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Explorar interesses
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className={`rounded-full px-4 py-2 text-sm transition ${selectedCategory === null
                                ? "bg-purple-600 text-white"
                                : "bg-white text-gray-700 hover:bg-purple-50"
                                }`}
                        >
                            Todas
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`rounded-full px-4 py-2 text-sm transition ${selectedCategory === category.slug
                                    ? "bg-purple-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-purple-50"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {loadingInterests ? (
                        <p className="text-gray-500">
                            Carregando interesses...
                        </p>
                    ) : interests.length === 0 ? (
                        <p className="text-gray-500">
                            Nenhum interesse encontrado nesta categoria.
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {interests.map((interest) => (
                                <article
                                    key={interest.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4"
                                >
                                    <h3 className="font-semibold text-gray-900">
                                        {interest.name}
                                    </h3>

                                    {interest.description && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {interest.description}
                                        </p>
                                    )}

                                    <p className="mt-3 text-xs text-gray-400">
                                        {interest.categories
                                            .map((category) => category.name)
                                            .join(", ")}
                                    </p>

                                    {myInterests.some(
                                        (item) => item.interest.id === interest.id
                                    ) ? (
                                        <p className="mt-4 text-sm font-medium text-purple-600">
                                            Já adicionado ao seu perfil
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleAddInterest(interest.id)}
                                            disabled={addingInterestId !== null}
                                            className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {addingInterestId === interest.id
                                                ? "Adicionando..."
                                                : "Adicionar ao perfil"}
                                        </button>
                                    )}

                                </article>
                            ))}
                        </div>
                    )}

                </section>
            </div>
        </main>
    );
}
