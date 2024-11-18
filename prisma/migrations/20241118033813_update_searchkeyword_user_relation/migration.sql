-- AddForeignKey
ALTER TABLE "Searchkeyword" ADD CONSTRAINT "Searchkeyword_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
