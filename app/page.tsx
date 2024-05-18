import { SearchDialog } from "@/components/SearchDialog";
import Image from "next/image";
import Link from "next/link";
import ExpandingArrow from "@/components/ui/expanding-arrow";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-evenly">
      <Link
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmadarco%2Fmada-vector&env=OPENAI_API_KEY,ADMIN_USER,ADMIN_PASSWORD&envDescription=Get%20an%20OpenAI%20Api%20Key%20and%20set%20ADMIN_USER%20and%20ADMIN_PASSWORD%20to%20the%20desired%20credentials%20to%20secure%20the%20%2Fadmin%20section.%20Also%20be%20sure%20to%20enable%20the%20Postgres%20database%20integration&envLink=https%3A%2F%2Fplatform.openai.com%2Fapi-keys&demo-title=Mada-Vector%3A%20RAG%20and%20Semantic%20Search&demo-description=%20Llamaindex%20Vercel%20Postgres%20RAG%20and%20Semantic%20Search&demo-url=https%3A%2F%2Fmada-vector.vercel.app%2F&demo-image=https%3A%2F%2Fmada-vector.vercel.app%2Fopengraph-image.png&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D"
        className="group rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
      >
        <p>One-Click Deploy your own to Vercel</p>
        <ExpandingArrow />
      </Link>

      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
       Self-Hosted Rag Search
      </h1>

      <div className="flex flex-col items-center justify-between">
        <div className="bg-white p-6 lg:p-12 pb-0 lg:pb-0 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
          <div className="flex justify-between items-center align-middle mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                Search your site content, and get answers
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
              Manage Indexed pages
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
        <div className="block lg:absolute bottom-12 left-12">
          <a href="https://madarco.net" className="hover:underline">
            Made by Madarco
          </a>
          <a
            href="https://twitter.com/madarco"
            className="ml-4 hover:underline"
          >
            Follow me on X
          </a>
        </div>
        <Link
          href="https://github.com/madarco/mada-vector"
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
