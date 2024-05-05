import { SearchDialog } from "@/components/SearchDialog";
import Image from "next/image";
import Link from "next/link";
import ExpandingArrow from "@/components/ui/expanding-arrow";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-evenly">
      <Link
        href="https://vercel.com/templates/next.js/postgres-pgvector"
        className="group rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
      >
        <p>Deploy your own to Vercel</p>
        <ExpandingArrow />
      </Link>

      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        One-click Install Semantic search
      </h1>

      <div className="flex flex-col items-center justify-between">
        <div className="bg-white p-6 lg:p-12 pb-0 lg:pb-0 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
          <div className="flex justify-between items-center align-middle mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                Search your site content, semantically
              </h2>
            </div>
          </div>
          <div>
            <SearchDialog />
          </div>
          <div className="text-right pt-2 lg:pt-8 pb-4 font-light">
            <Link
              href="/admin"
              className="font-medium underline underline-offset-4 hover:text-black transition-colors"
            >
              Manage Index
            </Link>
          </div>
        </div>
        <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
          Semantic search with{" "}
          <Link
            href="https://vercel.com/postgres"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Vercel Postgres
          </Link>
          ,{" "}
          <Link
            href="https://github.com/pgvector/pgvector-node#prisma"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            pgvector
          </Link>
          ,{" "}
          <Link
            href="https://platform.openai.com/docs/guides/embeddings"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            OpenAI
          </Link>
          ,{" "}
          <Link
            href="https://www.llamaindex.ai/"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Llamaindex
          </Link>{" "}
          .
        </p>
      </div>
      {/* FOOTER */}
      <div className="mt-12 w-full flex items-center justify-between px-6 ">
        <Link
          href="https://vercel.com"
          className="block lg:absolute bottom-12 left-12"
        >
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href="https://github.com/vercel/examples/tree/main/storage/postgres-pgvector"
          className="lg:absolute bottom-12 right-12 flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <span className="font-light">Source</span>
        </Link>
      </div>
    </main>
  );
}
