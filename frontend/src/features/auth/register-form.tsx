
"use client";

import { useState } from "react";
import { ApiError } from "@/services/api";
import { registerUser } from "./services";

export function RegisterForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        date_of_birth: "",
        username: "",
        display_name: "",
        bio: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await registerUser({
                ...form,
                bio: form.bio.trim() || undefined,
            });

            setSuccess(true);
            setForm({
                email: "",
                password: "",
                date_of_birth: "",
                username: "",
                display_name: "",
                bio: "",
            });
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Não foi possível realizar o cadastro. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label htmlFor="display_name">Nome de exibição</label>
                <input
                    id="display_name"
                    name="display_name"
                    value={form.display_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="username">Nome de usuário</label>
                <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">E-mail</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="date_of_birth">Data de nascimento</label>
                <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="bio">Biografia (opcional)</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                />
            </div>

            {error && (
                <p role="alert" className="text-red-600">
                    {error}
                </p>
            )}

            {success && (
                <p role="status" className="text-green-700">
                    Cadastro realizado com sucesso!
                </p>
            )}

            <button type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Criar conta"}
            </button>
        </form>
    );
}
