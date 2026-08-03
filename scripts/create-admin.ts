import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

config({ path: ".env.local" });
config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Umar Abdullah";

  if (!connectionString) throw new Error("DATABASE_URL is required");
  if (!email) throw new Error("ADMIN_EMAIL is required");
  if (!password || password.length < 12) {
    throw new Error("ADMIN_PASSWORD is required and must contain at least 12 characters");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.upsert({
      where: { email },
      update: { name, password: passwordHash },
      create: { email, name, password: passwordHash },
    });
    console.log(`Admin account ready: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
