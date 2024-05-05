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
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export function AddPageDialog(props: { reload: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
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
    setUrl("");
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("/api/secure/page", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
      .then((res) => {
        setLoading(false);
        if (!res.ok) {
          throw new Error("Failed to add page: " + res.statusText);
        }
        toast.success("Page added");
        props.reload();
        setUrl("");
        return res.json();
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <>
      <a
        href="#"
        onClick={() => setOpen(true)}
        className="text-base underline underline-offset-4 px-4 hover:text-black font-medium"
      >
        Add Page
      </a>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black">
          <DialogHeader>
            <DialogTitle>Add a page</DialogTitle>
            <DialogDescription>
              Insert the url of the page you want to index
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
                  placeholder="https://..."
                  name="search"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    url ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{" "}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) =>
                    setUrl("https://en.wikipedia.org/wiki/Roman_Empire")
                  }
                >
                  Wikipedia: The Roman Empire
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="bg-red-500">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
