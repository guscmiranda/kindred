
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import Link from "next/link";

export default function HomePage() {
    return (
        <AuthenticatedLayout>
            <section className="py-10">
                <h1 className="text-3xl font-bold tracking-tight text-[#201c2b]">
                    Bem-vindo ao Kindred!
                </h1>

                <p className="mt-3 max-w-2xl leading-relaxed text-[#777181]">
                    Descubra lugares, explore seus interesses e encontre
                    novas possibilidades de conexão.
                </p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    <Link
                        href="/profile"
                        className="rounded-2xl border border-[#e9e5ef] bg-white p-6 transition hover:border-[#7656d6]"
                    >
                        <h2 className="text-xl font-semibold text-[#201c2b]">
                            Meu perfil
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-[#777181]">
                            Visualize e gerencie suas informações pessoais
                            e seus interesses.
                        </p>
                    </Link>

                    <Link
                        href="/places"
                        className="rounded-2xl border border-[#e9e5ef] bg-white p-6 transition hover:border-[#7656d6]"
                    >
                        <h2 className="text-xl font-semibold text-[#201c2b]">
                            Descobrir lugares
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-[#777181]">
                            Explore estabelecimentos e encontre lugares
                            que combinam com suas preferências.
                        </p>
                    </Link>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
