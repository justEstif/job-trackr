# Lucia + Next.js demo

Install dependencies:

```bash
pnpm i
```

Migrate Prisma schema:

```bash
npx prisma migrate dev --name init
```

Run:

```bash
pnpm dev
```

## TODO

- create withAuth middleware
- add `trace` to error api responses
  - not shown on the UI
- test company api with different users
