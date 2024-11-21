const { faker } = require("@faker-js/faker");
const prisma = require("../prisma");

const seed = async (numTracks = 20) => {
  const tracks = Array.from({ length: numTracks }, () => ({
    title: faker.music.songName(),
  }));
  await prisma.track.createMany({ data: tracks });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });