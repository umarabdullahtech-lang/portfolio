import { config } from "dotenv";

config({ path: ".env.local" });

const [{ PrismaClient }, { PrismaPg }, { portfolioProjects }, { projectToRecord }] = await Promise.all([
  import("../src/generated/prisma/client.js"),
  import("@prisma/adapter-pg"),
  import("../src/data/projects.js"),
  import("../src/lib/project-record.js"),
]);

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
