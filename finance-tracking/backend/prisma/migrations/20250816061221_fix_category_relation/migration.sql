-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
