
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/services/api";

import {
    getPlaceAttributes,
    getPlaceById,
    getPlaceCategories,
    updatePlace,
} from "./services";

import type {
    Place,
    PlaceAttribute,
    PlaceCategory,
} from "./types";

interface EditPlaceViewProps {
    placeId: string;
}

export function EditPlaceView({ placeId }: EditPlaceViewProps) {
    const router = useRouter();

    const [categories, setCategories] = useState<PlaceCategory[]>([]);
    const [attributes, setAttributes] = useState<PlaceAttribute[]>([]);
    const [place, setPlace] = useState<Place | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);
                setError(null);

                const [
                    placeResponse,
                    categoriesResponse,
                    attributesResponse,
                ] = await Promise.all([
                    getPlaceById(placeId),
                    getPlaceCategories(),
                    getPlaceAttributes(),
                ]);

                setPlace(placeResponse);
                setCategories(categoriesResponse);
                setAttributes(attributesResponse);

                setName(placeResponse.name);
                setDescription(placeResponse.description ?? "");
                setAddress(placeResponse.address);

                setLatitude(
                    placeResponse.latitude !== null
                        ? String(placeResponse.latitude)
                        : ""
                );

                setLongitude(
                    placeResponse.longitude !== null
                        ? String(placeResponse.longitude)
                        : ""
                );

                setSelectedCategories(
                    placeResponse.categories.map((category) => category.id)
                );

                setSelectedAttributes(
                    placeResponse.attributes.map((attribute) => attribute.id)
                );
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("Não foi possível carregar os dados do estabelecimento.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadFormData();
    }, [placeId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError(null);

        if (!name.trim() || !address.trim()) {
            setSubmitError("Preencha o nome e o endereço do estabelecimento.");
            return;
        }

        const hasLatitude = latitude.trim() !== "";
        const hasLongitude = longitude.trim() !== "";

        if (hasLatitude !== hasLongitude) {
            setSubmitError(
                "Informe latitude e longitude juntas ou deixe ambas vazias."
            );
            return;
        }

        const latitudeValue = hasLatitude ? Number(latitude) : null;
        const longitudeValue = hasLongitude ? Number(longitude) : null;

        if (
            (latitudeValue !== null &&
                (!Number.isFinite(latitudeValue) ||
                    latitudeValue < -90 ||
                    latitudeValue > 90)) ||
            (longitudeValue !== null &&
                (!Number.isFinite(longitudeValue) ||
                    longitudeValue < -180 ||
                    longitudeValue > 180))
        ) {
            setSubmitError("Informe coordenadas geográficas válidas.");
            return;
        }

        try {
            setSubmitting(true);

            await updatePlace(placeId, {
                name: name.trim(),
                description: description.trim() || null,
                address: address.trim(),
                latitude: latitudeValue,
                longitude: longitudeValue,
                category_ids: selectedCategories,
                attribute_ids: selectedAttributes,
            });

            router.push(`/places/${placeId}`);
        } catch (err) {
            if (err instanceof ApiError) {
                setSubmitError(err.message);
            } else {
                setSubmitError("Não foi possível atualizar o estabelecimento.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <p className="p-8">Carregando dados do estabelecimento...</p>;
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 p-8">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    if (!place) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900">
                    Editar estabelecimento
                </h1>

                <p className="mt-2 text-gray-600">
                    Atualize as informações de {place.name}.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Informações básicas
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nome do estabelecimento *
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                    maxLength={150}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                                    Descrição
                                </label>

                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    rows={4}
                                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                                    Endereço *
                                </label>

                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Localização geográfica
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            As coordenadas são opcionais, mas ajudam o Kindred a localizar o estabelecimento.
                        </p>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="latitude" className="mb-2 block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>

                                <input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    min="-90"
                                    max="90"
                                    value={latitude}
                                    onChange={(event) => setLatitude(event.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="longitude" className="mb-2 block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>

                                <input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    min="-180"
                                    max="180"
                                    value={longitude}
                                    onChange={(event) => setLongitude(event.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Categorias
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Selecione as categorias que melhor representam seu estabelecimento.
                            Você pode escolher mais de uma.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {categories.map((category) => {
                                const selected = selectedCategories.includes(category.id);

                                return (
                                    <label
                                        key={category.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${selected
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-purple-300"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setSelectedCategories((current) => [
                                                        ...current,
                                                        category.id,
                                                    ]);
                                                } else {
                                                    setSelectedCategories((current) =>
                                                        current.filter((id) => id !== category.id)
                                                    );
                                                }
                                            }}
                                            className="h-4 w-4 accent-purple-600"
                                        />

                                        <span className="text-sm font-medium text-gray-800">
                                            {category.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Características do estabelecimento
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Selecione as características que descrevem seu estabelecimento.
                            Você pode escolher várias opções em cada grupo.
                        </p>

                        <div className="mt-6 space-y-8">
                            {(
                                [
                                    ["ambience", "Ambiente"],
                                    ["activities", "Atividades"],
                                    ["music", "Música"],
                                    ["audience", "Público"],
                                ] as const
                            ).map(([group, title]) => {
                                const groupAttributes = attributes.filter(
                                    (attribute) => attribute.group === group
                                );

                                return (
                                    <div key={group}>
                                        <h3 className="mb-3 font-medium text-gray-800">
                                            {title}
                                        </h3>

                                        {groupAttributes.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                Nenhuma característica disponível.
                                            </p>
                                        ) : (
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {groupAttributes.map((attribute) => {
                                                    const selected = selectedAttributes.includes(
                                                        attribute.id
                                                    );

                                                    return (
                                                        <label
                                                            key={attribute.id}
                                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${selected
                                                                    ? "border-purple-500 bg-purple-50"
                                                                    : "border-gray-200 hover:border-purple-300"
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selected}
                                                                onChange={(event) => {
                                                                    if (event.target.checked) {
                                                                        setSelectedAttributes((current) => [
                                                                            ...current,
                                                                            attribute.id,
                                                                        ]);
                                                                    } else {
                                                                        setSelectedAttributes((current) =>
                                                                            current.filter(
                                                                                (id) => id !== attribute.id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                                className="h-4 w-4 accent-purple-600"
                                                            />

                                                            <span className="text-sm font-medium text-gray-800">
                                                                {attribute.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {submitError && (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {submitError}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.push(`/places/${placeId}`)}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
