
import { env } from "@/lib/env";

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${env.apiUrl}${endpoint}`, {
        ...options,
        credentials: "include",
    });

    if (!response.ok) {
        let message = `Erro na requisição: ${response.status}`;

        try {

            const data = await response.json();

            if (typeof data.detail === "string") {
                message = data.detail;
            } else if (Array.isArray(data.detail)) {
                message = data.detail
                    .map((item: {
                        loc?: (string | number)[];
                        msg?: string;
                    }) => {
                        const field = item.loc?.[item.loc.length - 1];

                        const fieldNames: Record<string, string> = {
                            password: "Senha",
                            email: "E-mail",
                            username: "Nome de usuário",
                            date_of_birth: "Data de nascimento",
                            display_name: "Nome de exibição",
                        };

                        const fieldName =
                            typeof field === "string"
                                ? fieldNames[field] ?? field
                                : "Campo";

                        return `${fieldName}: ${item.msg ?? "Valor inválido"}`;
                    })
                    .join(". ");
            }

        } catch {
            // Mantém a mensagem padrão caso a resposta não seja JSON.
        }

        throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
