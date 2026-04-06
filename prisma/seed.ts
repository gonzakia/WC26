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
    },
  });

  await prisma.match.upsert({
    where: { slug: "mexico-vs-japan-2026-06-11" },
    update: {},
    create: {
      slug: "mexico-vs-japan-2026-06-11",
      stage: "Group Stage",
      kickoffAt: new Date("2026-06-11T20:00:00.000Z"),
      homeTeam: "Mexico",
      awayTeam: "Japan",
      venue: "Estadio Azteca",
    },
  });

  await prisma.match.upsert({
    where: { slug: "united-states-vs-ghana-2026-06-12" },
    update: {},
    create: {
      slug: "united-states-vs-ghana-2026-06-12",
      stage: "Group Stage",
      kickoffAt: new Date("2026-06-12T19:00:00.000Z"),
      homeTeam: "United States",
      awayTeam: "Ghana",
      venue: "SoFi Stadium",
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
