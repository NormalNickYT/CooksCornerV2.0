/**
 * Development seed data.
 *
 * Idempotent: safe to run repeatedly. Recipes are keyed by slug, so a re-run
 * replaces them rather than piling up duplicates.
 *
 *   npm run db:seed
 */
import { PrismaClient, type RecipeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify, totalTimeOf } from "@cookscorner/shared";

const prisma = new PrismaClient();

/** Every seeded account shares this password, so signing in locally is easy. */
const DEMO_PASSWORD = "cookscorner123";

interface SeedIngredient {
  name: string;
  amount: number | null;
  unit: string | null;
  scalable?: boolean;
  note?: string | null;
}

interface SeedRecipe {
  title: string;
  description: string;
  tips?: string;
  status?: RecipeStatus;
  servings: number;
  preparationTime: number;
  cookTime?: number;
  categories: string[];
  ingredients: SeedIngredient[];
  steps: string[];
}

const USERS = [
  { email: "nick@cookscorner.test", username: "nick", name: "Nick" },
  { email: "sanne@cookscorner.test", username: "sanne", name: "Sanne" },
];

/**
 * Deliberately varied: different base servings, fractional amounts, unscalable
 * pinches and an ingredient with no amount at all, so the scaling engine has
 * something real to chew on straight after seeding.
 */
const RECIPES: Array<{ authorEmail: string; recipe: SeedRecipe }> = [
  {
    authorEmail: "nick@cookscorner.test",
    recipe: {
      title: "Tacos met gehakt",
      description:
        "Het vrijdagavondgerecht bij ons thuis. Iedereen bouwt zijn eigen taco, dus niemand klaagt over de vulling.",
      tips: "Verwarm de tortillas kort in een droge koekenpan, dan breken ze niet bij het vouwen.",
      status: "active",
      servings: 4,
      preparationTime: 20,
      cookTime: 15,
      categories: ["Diner", "Mexicaans"],
      ingredients: [
        { name: "tortilla", amount: 8, unit: "stuk" },
        { name: "rundergehakt", amount: 500, unit: "g" },
        { name: "ui", amount: 1, unit: "stuk" },
        { name: "knoflook", amount: 2, unit: "teen" },
        { name: "tomatenblokjes", amount: 1, unit: "blik" },
        { name: "komijnpoeder", amount: 2, unit: "tl" },
        { name: "paprikapoeder", amount: 1, unit: "tl" },
        { name: "ijsbergsla", amount: 0.5, unit: "stuk" },
        { name: "geraspte kaas", amount: 150, unit: "g" },
        { name: "zout", amount: 1, unit: "snufje", scalable: false },
      ],
      steps: [
        "Snipper de ui en pers de knoflook.",
        "Bak het gehakt rul in een hete pan, ongeveer 5 minuten.",
        "Voeg ui, knoflook, komijn en paprikapoeder toe en bak 2 minuten mee.",
        "Roer de tomatenblokjes erdoor en laat 10 minuten pruttelen tot het ingedikt is.",
        "Verwarm de tortillas en zet alles op tafel zodat iedereen zelf kan vullen.",
      ],
    },
  },
  {
    authorEmail: "nick@cookscorner.test",
    recipe: {
      title: "Pannenkoeken",
      description: "Het basisrecept van mijn oma. Precies genoeg beslag voor een zondagochtend.",
      tips: "Laat het beslag een half uur rusten, dan worden de pannenkoeken luchtiger.",
      status: "active",
      servings: 2,
      preparationTime: 10,
      cookTime: 20,
      categories: ["Ontbijt", "Zoet"],
      ingredients: [
        { name: "bloem", amount: 250, unit: "g" },
        { name: "melk", amount: 500, unit: "ml" },
        { name: "ei", amount: 2, unit: "stuk" },
        { name: "zout", amount: 1, unit: "snufje", scalable: false },
        { name: "boter", amount: 1, unit: "el", note: "om in te bakken" },
      ],
      steps: [
        "Doe de bloem in een kom en maak een kuiltje in het midden.",
        "Klop de eieren los met een deel van de melk en giet dit in het kuiltje.",
        "Roer vanuit het midden tot een glad beslag en voeg de rest van de melk toe.",
        "Laat het beslag 30 minuten rusten.",
        "Bak de pannenkoeken in een hete pan met een klontje boter, ongeveer 2 minuten per kant.",
      ],
    },
  },
  {
    authorEmail: "sanne@cookscorner.test",
    recipe: {
      title: "Pompoensoep met gember",
      description: "Romig zonder room. De gember maakt het net wat spannender dan gewone pompoensoep.",
      status: "active",
      servings: 6,
      preparationTime: 15,
      cookTime: 30,
      categories: ["Lunch", "Soep", "Vegetarisch"],
      ingredients: [
        { name: "flespompoen", amount: 1, unit: "stuk" },
        { name: "ui", amount: 2, unit: "stuk" },
        { name: "verse gember", amount: 3, unit: "cm" },
        { name: "groentebouillon", amount: 1, unit: "l" },
        { name: "kokosmelk", amount: 400, unit: "ml" },
        { name: "olijfolie", amount: 2, unit: "el" },
        { name: "peper", amount: null, unit: "naar smaak", scalable: false },
      ],
      steps: [
        "Schil de pompoen, verwijder de zaadlijsten en snijd in blokjes.",
        "Fruit de ui en gember in de olijfolie tot de ui glazig is.",
        "Voeg de pompoen toe en schenk de bouillon erbij.",
        "Laat 25 minuten zachtjes koken tot de pompoen gaar is.",
        "Pureer de soep glad en roer de kokosmelk erdoor. Breng op smaak met peper.",
      ],
    },
  },
  {
    authorEmail: "sanne@cookscorner.test",
    recipe: {
      title: "Chocolademousse",
      description: "Vier ingredienten, geen oven. Wel een nacht geduld.",
      tips: "Gebruik chocolade van minstens 70 procent, anders wordt het te zoet.",
      status: "active",
      servings: 4,
      preparationTime: 25,
      categories: ["Dessert", "Zoet"],
      ingredients: [
        { name: "pure chocolade", amount: 200, unit: "g" },
        { name: "ei", amount: 4, unit: "stuk" },
        { name: "suiker", amount: 50, unit: "g" },
        { name: "zout", amount: 1, unit: "snufje", scalable: false },
      ],
      steps: [
        "Smelt de chocolade au bain-marie en laat iets afkoelen.",
        "Scheid de eieren. Klop de dooiers los door de chocolade.",
        "Klop de eiwitten met het zout stijf en voeg al kloppend de suiker toe.",
        "Spatel het eiwit in drie delen door de chocolade, voorzichtig zodat het luchtig blijft.",
        "Verdeel over glaasjes en laat minstens 4 uur opstijven in de koelkast.",
      ],
    },
  },
  {
    authorEmail: "nick@cookscorner.test",
    recipe: {
      title: "Ovenschotel met zoete aardappel",
      description: "Nog niet af, ik moet de kruiden nog uitproberen.",
      status: "draft",
      servings: 4,
      preparationTime: 20,
      cookTime: 40,
      categories: ["Diner", "Vegetarisch"],
      ingredients: [
        { name: "zoete aardappel", amount: 800, unit: "g" },
        { name: "kikkererwten", amount: 1, unit: "blik" },
        { name: "feta", amount: 100, unit: "g" },
      ],
      steps: [
        "Snijd de zoete aardappel in blokjes.",
        "Alles in de oven op 200 graden, 40 minuten.",
      ],
    },
  },
];

async function main(): Promise<void> {
  console.log("Seeding...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const users = new Map<string, string>();
  for (const user of USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: { ...user, passwordHash },
    });
    users.set(user.email, record.id);
  }
  console.log("  " + users.size + " users");

  let created = 0;
  for (const { authorEmail, recipe } of RECIPES) {
    const authorId = users.get(authorEmail);
    if (!authorId) continue;

    const slug = slugify(recipe.title);

    const categoryIds = await Promise.all(
      recipe.categories.map(async (title) => {
        const category = await prisma.category.upsert({
          where: { slug: slugify(title) },
          update: {},
          create: { slug: slugify(title), title },
        });
        return category.id;
      }),
    );

    // Replace rather than duplicate, so re-seeding stays safe.
    await prisma.recipe.deleteMany({ where: { slug } });

    await prisma.recipe.create({
      data: {
        slug,
        title: recipe.title,
        description: recipe.description,
        tips: recipe.tips ?? null,
        status: recipe.status ?? "active",
        servings: recipe.servings,
        preparationTime: recipe.preparationTime,
        cookTime: recipe.cookTime ?? null,
        totalTime: totalTimeOf({
          preparationTime: recipe.preparationTime,
          cookTime: recipe.cookTime ?? null,
        }),
        author: { connect: { id: authorId } },
        ingredients: {
          create: recipe.ingredients.map((ingredient, index) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            scalable: ingredient.scalable ?? true,
            note: ingredient.note ?? null,
            position: index,
          })),
        },
        steps: {
          create: recipe.steps.map((content, index) => ({ content, position: index })),
        },
        categories: {
          create: categoryIds.map((categoryId) => ({ category: { connect: { id: categoryId } } })),
        },
      },
    });
    created += 1;
  }

  console.log("  " + created + " recipes");
  console.log("\nSign in with any seeded email and the password: " + DEMO_PASSWORD);
  for (const user of USERS) console.log("  " + user.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
