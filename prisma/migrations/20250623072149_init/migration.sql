/*
  Warnings:

  - You are about to drop the column `description` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postType` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `urlLink` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Post` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Post_slug_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "postType",
DROP COLUMN "slug",
DROP COLUMN "urlLink",
DROP COLUMN "videoUrl",
ADD COLUMN     "ImageUrl" TEXT,
ADD COLUMN     "Links" TEXT,
ADD COLUMN     "VideoUrl" TEXT,
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "isPublished" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
