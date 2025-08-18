-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
