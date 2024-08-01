import prisma from "./prisma";

async function Seed() {
  const categories = ["Lunch", "Breakfast"];

  const categoryPromises = categories.map(async (title) => {
    const existingCategory = await prisma.category.findFirst({
      where: { title }
    });

    if (existingCategory) {
      return existingCategory;
    } else {
      return await prisma.category.create({
        data: { title }
      });
    }
  });

  const createdCategories = await Promise.all(categoryPromises);
  const categoryIds = createdCategories.map((category) => category.id);

  const user1 = await prisma.user.upsert({
    where: { email: "test@gmail.com" },
    update: {},
    create: {
      name: "Test",
      email: "test@gmail.com",
      username: "Test",
      avatar:
        "https://cdn.pixabay.com/photo/2015/02/13/00/43/apples-634572_1280.jpg",
      googleId: "1234567890",
      password: "",
      posts: {
        create: [
          {
            title: "Tacos Gerecht",
            url: "https://www.prisma.io/nextjs",
            image:
              "https://cdn.pixabay.com/photo/2015/02/13/00/43/apples-634572_1280.jpg",
            categories: {
                connect: categoryIds.map((id) => ({ id })), 
            },
            createdAt: new Date(),
            status: "Active",
            preparationTime: 30,
            approach: "Mix and Cook",
          },
        ],
      },
    },
  });
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
