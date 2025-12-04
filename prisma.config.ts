import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
} as const;
