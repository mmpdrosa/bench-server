/*
  Warnings:

  - You are about to drop the `prices_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prices_history" DROP CONSTRAINT "prices_history_product_id_fkey";

-- DropTable
DROP TABLE "prices_history";

-- CreateTable
CREATE TABLE "products_price_history" (
    "id" TEXT NOT NULL,
    "was_available" BOOLEAN NOT NULL,
    "last_availability" BOOLEAN NOT NULL,
    "lowest_price" INTEGER NOT NULL,
    "last_price" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "products_price_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products_price_history" ADD CONSTRAINT "products_price_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
