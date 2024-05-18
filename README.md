# Mada-Vector: Vercel Semantic Search and RAG that runs on Vercel Postgres

A Next.js template that uses [Vercel Postgres](https://vercel.com/postgres) as the database, [Prisma](https://prisma.io/) as the ORM with [pgvector](https://github.com/pgvector/pgvector-node#prisma) to enable vector similarity search, and OpenAI's [`text-embedding-ada-002`](https://platform.openai.com/docs/guides/embeddings) model for embeddings,
[Llamaindex](https://www.llamaindex.ai/) for indexing pages.

If you like this tool and starter kit, add a star on GitHub and follow me on X [@madarco](https://twitter.com/madarco)!

## Demo

https://mada-vector.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### Admin login

Login to /admin url via the ADMIN_USER and ADMIN_PASSWORD defined in the env variables.

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmadarco%2Fmada-vector&env=OPENAI_API_KEY,ADMIN_USER,ADMIN_PASSWORD&envDescription=Get%20an%20OpenAI%20Api%20Key%20and%20set%20ADMIN_USER%20and%20ADMIN_PASSWORD%20to%20the%20desired%20credentials%20to%20secure%20the%20%2Fadmin%20section.%20Also%20be%20sure%20to%20enable%20the%20Postgres%20database%20integration&envLink=https%3A%2F%2Fplatform.openai.com%2Fapi-keys&demo-title=Mada-Vector%3A%20RAG%20and%20Semantic%20Search&demo-description=%20Llamaindex%20Vercel%20Postgres%20RAG%20and%20Semantic%20Search&demo-url=https%3A%2F%2Fmada-vector.vercel.app%2F&demo-image=https%3A%2F%2Fmada-vector.vercel.app%2Fopengraph-image.png&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D)

### Manual

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/madarco/mada-vector
```

Once that's done, copy the .env.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).
