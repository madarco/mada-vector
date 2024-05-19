"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCompletion } from "ai/react";
import {
  X,
  Loader,
  User,
  Frown,
  CornerDownLeft,
  Search,
  Wand,
  ArrowLeft,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  const [pages, setPages] = React.useState(
    [] as { title: string; excerpt: string; score: number; url: string }[]
  );

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/rag",
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen(true);
      }

      if (e.key === "Escape") {
        console.log("esc");
        handleModalToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleModalToggle() {
    setOpen(!open);
    setQuery("");
  }

  function search(query: string) {
    fetch("/api/vector-search", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.results) {
          throw new Error("No results found");
        }
        setPages(data.results);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  const queryandSubmit = (query: string) => {
    setQuery(query);
    complete(query);
    search(query);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    complete(query);
    search(query);
  };

  function getPageTitle(page: any) {
    if (page.title.trim()) {
      page.title.slice(0, 50)
    }
    // filename:
    const url = new URL(page.url)
    return url.pathname.split('/').pop()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[300px] w-full"
      >
        <Search width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">Search...</span>
        <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{" "}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black">
          <DialogHeader>
            <DialogTitle>Vector Embeddings-powered search and Rag</DialogTitle>
            <DialogDescription>
              Ask any questions to get answers from the indexed pages.
            </DialogDescription>
            <hr />
            <button
              className="absolute top-0 right-2 p-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              <div className="relative">
                <Input
                  placeholder="Ask a question..."
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100 space-2">
                Or try:{" "}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(e) => queryandSubmit("What are embeddings?")}
                >
                  What are embeddings?
                </button>{" "}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) => queryandSubmit("When the roman empire ended?")}
                >
                  When the roman empire ended?
                </button>
              </div>
            </div>
            {query && (
              <div className="flex gap-4 mb-2">
                <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <User width={18} />{" "}
                </span>
                <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                  {query}
                </p>
              </div>
            )}

            {isLoading && (
              <div className="animate-spin relative flex w-5 h-5 ml-2">
                <Loader />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-4">
                <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <Frown width={18} />
                </span>
                <span className="text-slate-700 dark:text-slate-100">
                  Sad news, the search has failed! Please try again.
                </span>
              </div>
            )}

            {completion && !error ? (
              <div className="border p-4">
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Wand width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Answer:</h3>
                </div>
                <div className="prose mt-2">
                  <Markdown remarkPlugins={[remarkGfm]}>{completion}</Markdown>
                </div>
              </div>
            ) : null}

            {pages.length > 0 && (
              <div className="mt-4 border p-4">
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-cyan-700 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Search width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Results:</h3>
                </div>
                <ul className="mt-2">
                  {pages.map((page) => (
                    <li key={page.title} className="py-2">
                      <h3 className="font-medium mb-1">
                        &raquo; <a className="underline" href={page.url}>{getPageTitle(page)}</a>
                        <small className="ml-4 font-normal float-right">(score: {page.score?.toFixed(3)})</small>
                      </h3>
                      <p className="italic font-light text-slate-700 dark:text-slate-100">
                        {page.excerpt.slice(page.excerpt.indexOf("\n"))}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" className="bg-red-500">
                Ask
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
