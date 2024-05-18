"use client";

import { AddPageDialog } from "@/components/AddPageDialog";
import { SearchDialog } from "@/components/SearchDialog";
import { Loader, ArrowBigLeftDash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

export default function Admin() {
  const [pages, setPages] = React.useState<any[]>([]);
  const [isLoading, setLoading] = React.useState(true);

  const [isLoadingRow, setLoadingRow] = React.useState(
    {} as Record<string, boolean>
  );

  function handleReload() {
    setLoading(true);
    fetch("/api/secure/page", { cache: "no-store" })
      .then((res) => res.json())
      .then((object) => {
        setPages(object.pages);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }
  React.useEffect(() => {
    handleReload();
  }, []);

  function deletePage(id: string) {
    setLoading(true);
    fetch(`/api/secure/page/${id}`, {
      method: "DELETE",
    }).then(() => {
      setPages(pages.filter((page) => page.id !== id));
      setLoading(false);
    });
  }

  async function reindex(id: string) {
    setLoadingRow({ [id]: true });
    const result = await fetch(`/api/secure/page/${id}/index`, {
      method: "POST",
    });
    const newPage = (await result.json())?.page;
    setPages(
      pages.map((page) =>
        page.id === id ? { ...newPage } : page
      )
    );
    setLoadingRow({ [id]: false });
  }

  async function reindexAll() {
    for (const page of pages) {
      await reindex(page.id);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-evenly">
      <div className="flex flex-col items-center justify-between">
        <div className="bg-white p-6 lg:p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg mx-auto w-full">
          <div className="mb-4">
            <div className="space-y-1">
              <h2 className="text-xl mb-4 font-semibold">
                <Link href="/" className="inline-block mb-[-5px] mr-4">
                  <ArrowBigLeftDash />
                </Link>
                Edit your indexed pages
                {isLoading && (
                  <div className="inline-block animate-spin relative w-5 h-5 ml-2">
                    <Loader />
                  </div>
                )}
                <span className="float-right text-base">
                  <AddPageDialog reload={handleReload} />
                </span>
              </h2>
              <div className="pb-8">
                {pages && (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Url
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Indexed
                          </th>
                          <th scope="col" className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pages.map((page) => (
                          <tr
                            key={page.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {page.url}
                            </th>
                            <td className="px-6 py-4">
                              {isLoadingRow[page.id] ? (
                                <div className="inline-block animate-spin relative w-5 h-5 ml-2">
                                  <Loader />
                                </div>
                              ) : page._count.pageChunks > 0 ? (
                                <abbr
                                  title={`${page._count.pageChunks} chunks indexed`}
                                >
                                  ✅
                                </abbr>
                              ) : (
                                "ⓧ"
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  reindex(page.id);
                                }}
                                className="text-black font-medium underline"
                              >
                                Index
                              </a>
                              {" - "}
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  confirm(
                                    "Are you sure you want to delete this page?"
                                  ) && deletePage(page.id);
                                }}
                                className="text-black font-medium underline"
                              >
                                🗑️
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  reindexAll();
                }}
                className="float-right text-base  px-4 py-2 z-50 relative 
                 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors
                rounded-md
                border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
               "
              >
                Re-Index
              </button>
            </div>
          </div>
          <div></div>
        </div>
        <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
          Embeddings created with{" "}
          <Link
            href="https://www.llamaindex.ai/"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Llamaindex
          </Link>{" "}
          and {""}
          <Link
            href="https://platform.openai.com/docs/guides/embeddings"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            OpenAI
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
