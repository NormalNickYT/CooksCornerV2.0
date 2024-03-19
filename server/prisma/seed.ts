import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function Seed() {
  // Seed some test data 
  const user1 = await prisma.user.upsert({
    where: { email: 'test@gmail.com' },
    update: {},
    create: {
      email: 'test@gmail.com',
      username: 'Test',
      password: "test",
      posts: {
        create: {
          title: 'Tacos Gerecht',
          url: 'https://www.prisma.io/nextjs',
          image: 'https://cdn.pixabay.com/photo/2015/02/13/00/43/apples-634572_1280.jpg', 
          categoryId: 1, 
          createdAt: new Date(),
      },
    },
    },
  });

  // const updatedPost = await prisma.post.update({
  //   where: { id: 1 },
  //   data: {
  //     image: 'https://cdn.pixabay.com/photo/2015/02/13/00/43/apples-634572_1280.jpg', 
  //   },
  // });

  // console.log({ user1, updatedPost });
}

Seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
