-- AlterTable
ALTER TABLE "contactos_recibidos" ADD COLUMN     "consentimiento_en" TIMESTAMP(3),
ADD COLUMN     "consentimiento_version" TEXT;

-- AlterTable
ALTER TABLE "socios" ADD COLUMN     "consentimiento_en" TIMESTAMP(3),
ADD COLUMN     "consentimiento_version" TEXT;
