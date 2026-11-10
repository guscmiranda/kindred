import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navegação */}
      <header className="w-full border-b border-[#e9e5ef] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#7656d6]">
            kindred<span className="text-[#201c2b]">.</span>
          </Link>

          <nav className="flex items-center gap-6">
            <a
              href="#sobre"
              className="hidden text-sm font-medium text-[#777181] transition hover:text-[#7656d6] sm:block"
            >
              Sobre
            </a>

            <a
              href="#como-funciona"
              className="hidden text-sm font-medium text-[#777181] transition hover:text-[#7656d6] sm:block"
            >
              Como funciona
            </a>

            <a
              href="#comecar"
              className="rounded-full bg-[#7656d6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6243c0]"
            >
              Começar
            </a>
          </nav>
        </div>
      </header>

      {/* Apresentação */}
      <section className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full border border-[#e9e5ef] bg-white px-4 py-2 text-sm font-medium text-[#7656d6]">
            Conexões além do algoritmo
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#201c2b] sm:text-6xl">
            Encontre pessoas que
            <span className="text-[#7656d6]"> compartilham </span>
            o que importa para você.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#777181]">
            O Kindred aproxima pessoas a partir de seus interesses,
            experiências e afinidades. Descubra novas conexões que
            realmente fazem sentido.
          </p>

          <div id="comecar" className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#como-funciona"
              className="rounded-full bg-[#7656d6] px-8 py-3.5 font-semibold text-white transition hover:bg-[#6243c0]"
            >
              Conheça o Kindred
            </a>

            <a
              href="#sobre"
              className="rounded-full border border-[#e9e5ef] bg-white px-8 py-3.5 font-semibold text-[#201c2b] transition hover:border-[#7656d6]"
            >
              Saiba mais
            </a>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="border-t border-[#e9e5ef] bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#201c2b]">
            Conexões com mais significado.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-[#777181]">
            Mais do que encontrar perfis, queremos ajudar você a descobrir
            pessoas com interesses, objetivos e ideias em comum.
          </p>

          <div
            id="como-funciona"
            className="mt-14 grid gap-6 text-left md:grid-cols-3"
          >
            <article className="rounded-2xl border border-[#e9e5ef] bg-[#faf9fc] p-6">
              <h3 className="text-lg font-semibold text-[#201c2b]">
                Descubra
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#777181]">
                Explore pessoas e comunidades a partir de interesses
                compartilhados.
              </p>
            </article>

            <article className="rounded-2xl border border-[#e9e5ef] bg-[#faf9fc] p-6">
              <h3 className="text-lg font-semibold text-[#201c2b]">
                Conecte-se
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#777181]">
                Encontre pessoas com experiências e objetivos semelhantes
                aos seus.
              </p>
            </article>

            <article className="rounded-2xl border border-[#e9e5ef] bg-[#faf9fc] p-6">
              <h3 className="text-lg font-semibold text-[#201c2b]">
                Compartilhe
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#777181]">
                Construa novas relações a partir daquilo que aproxima vocês.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-[#e9e5ef] bg-white px-6 py-6">
        <p className="text-center text-sm text-[#777181]">
          © 2026 Kindred. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
