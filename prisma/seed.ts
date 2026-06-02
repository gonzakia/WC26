import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "kia@example.com" },
    update: {
      displayName: "Kia",
    },
    create: {
      email: "kia@example.com",
      displayName: "Kia",
    },
  });

  const group = await prisma.group.upsert({
    where: { inviteCode: "WC26DEMO" },
    update: {},
    create: {
      name: "Friends League",
      inviteCode: "WC26DEMO",
      creatorId: user.id,
    },
  });

  await prisma.groupMember.upsert({
    where: {
      userId_groupId: {
        userId: user.id,
        groupId: group.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      groupId: group.id,
      role: "OWNER",
      displayName: "Kia",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
