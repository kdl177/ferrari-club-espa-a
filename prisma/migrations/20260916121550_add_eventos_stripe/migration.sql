-- CreateEnum
CREATE TYPE "ResultadoEventoStripe" AS ENUM ('procesado', 'ignorado', 'error');

-- CreateTable
CREATE TABLE "eventos_stripe" (
    "id" TEXT NOT NULL,
    "stripe_event_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "resultado" "ResultadoEventoStripe" NOT NULL,
    "detalle" TEXT,
    "socio_id" TEXT,
    "payload_resumen" JSONB,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_stripe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eventos_stripe_stripe_event_id_key" ON "eventos_stripe"("stripe_event_id");

-- CreateIndex
CREATE INDEX "eventos_stripe_resultado_idx" ON "eventos_stripe"("resultado");

-- CreateIndex
CREATE INDEX "eventos_stripe_creadoEn_idx" ON "eventos_stripe"("creadoEn");
