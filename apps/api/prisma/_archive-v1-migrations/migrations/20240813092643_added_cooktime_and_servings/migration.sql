/*
  Warnings:

  - Added the required column `servings` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "cookTime" INTEGER,
ADD COLUMN     "servings" INTEGER NOT NULL;
