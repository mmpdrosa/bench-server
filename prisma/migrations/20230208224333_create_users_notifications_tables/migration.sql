-- CreateTable
CREATE TABLE "users_products_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "users_products_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_categories_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "users_categories_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_products_notifications" ADD CONSTRAINT "users_products_notifications_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_categories_notifications" ADD CONSTRAINT "users_categories_notifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
