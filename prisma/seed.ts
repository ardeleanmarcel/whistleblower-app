import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a company
  const company = await prisma.company.upsert({
    where: { id: "test-company-1" },
    update: {},
    create: {
      id: "test-company-1",
      name: "Test Company",
    },
  });

  console.log("Created company:", company);

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password", salt);

  // Create a manager
  const manager = await prisma.manager.upsert({
    where: { email: "admin@example.com" },
    update: {
      passwordHash,
    },
    create: {
      email: "admin@example.com",
      passwordHash,
      companyId: company.id,
    },
  });

  console.log("Created manager:", {
    email: manager.email,
    id: manager.id,
  });

  // Create a magic link
  const magicLink = await prisma.magicLink.create({
    data: {
      token: "test-token-123",
      label: "Test Report Link",
      active: true,
      companyId: company.id,
    },
  });

  console.log("Created magic link:", magicLink);
}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
