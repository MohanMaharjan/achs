/*
  Warnings:

  - You are about to drop the column `ImageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `Links` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `VideoUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "ImageUrl",
DROP COLUMN "Links",
DROP COLUMN "VideoUrl",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "links" TEXT,
ADD COLUMN     "videoUrl" TEXT;
