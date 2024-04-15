-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "approach" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "preperationTime" TIMESTAMP(3),
ADD COLUMN     "tips" TEXT,
ALTER COLUMN "url" DROP NOT NULL;
