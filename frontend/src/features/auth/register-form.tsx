
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/services/api";
import { useAuth } from "@/features/auth/auth-context";

import {
    registerUser,
    loginUser,
} from "./services";

export function RegisterForm() {
    const router = useRouter();
    const { refreshUser } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
        date_of_birth: "",
        username: "",
        display_name: "",
        bio: "",
    });

    const [error, setError] = useState("");
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
        setLoading(true);

        let accountCreated = false;

        try {
            await registerUser({
                ...form,
                bio: form.bio.trim() || undefined,
            });

            accountCreated = true;

            await loginUser({
                email: form.email,
                password: form.password,
            });

            await refreshUser();

            router.replace("/home");
        } catch (err) {
            if (accountCreated) {
                setError(
                    "Conta criada, mas não foi possível entrar automaticamente. Tente fazer login."
                );
            } else if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError(
                    "Não foi possível realizar o cadastro. Tente novamente."
                );
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

            <button type="submit" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
            </button>
        </form>
    );
}
