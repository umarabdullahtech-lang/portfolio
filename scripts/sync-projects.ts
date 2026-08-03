import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { portfolioProjects } from "../src/data/projects.js";
import { projectToRecord } from "../src/lib/project-record.js";

config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const project of portfolioProjects) {
      const data = projectToRecord(project);
      await prisma.project.upsert({
        where: { id: project.id },
        update: data,
        create: { id: project.id, ...data },
      });
    }
    const total = await prisma.project.count();
    console.log(`Synchronized ${portfolioProjects.length} catalog projects. Database now contains ${total} projects.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
