import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const CS = await prisma.branch.create({
    data: {
      name: "CS",
    },
  });
  const IS = await prisma.branch.create({
    data: {
      name: "IS",
    },
  });
  const AIML = await prisma.branch.create({
    data: {
      name: "AIML",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
