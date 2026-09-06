/*
  Warnings:

  - You are about to drop the column `postId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_postId_idx";

-- DropIndex
DROP INDEX "Category_postId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "categoryId";
