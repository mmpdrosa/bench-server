/*
  Warnings:

  - Made the column `recommended` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "available" SET DEFAULT true;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "recommended" SET NOT NULL,
ALTER COLUMN "recommended" SET DEFAULT false;

-- AlterTable
ALTER TABLE "products_retailers" ALTER COLUMN "available" SET DEFAULT true;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "product_id" TEXT;

-- CreateTable
CREATE TABLE "sales_reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,

    CONSTRAINT "sales_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_reactions_user_id_sale_id_content_key" ON "sales_reactions"("user_id", "sale_id", "content");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_reactions" ADD CONSTRAINT "sales_reactions_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
