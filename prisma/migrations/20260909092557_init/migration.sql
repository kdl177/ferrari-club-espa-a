-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('pendiente', 'activo', 'moroso', 'baja');

-- CreateEnum
CREATE TYPE "PlanSuscripcion" AS ENUM ('base', 'activo', 'familiar');

-- CreateEnum
CREATE TYPE "EstadoSuscripcion" AS ENUM ('activa', 'impagada', 'cancelada');

-- CreateEnum
CREATE TYPE "EstadoInscripcion" AS ENUM ('confirmada', 'lista_espera', 'cancelada');

-- CreateTable
CREATE TABLE "socios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT,
    "ferrariModelo" TEXT,
    "estadoCuota" "EstadoCuota" NOT NULL DEFAULT 'pendiente',
    "stripeCustomerId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "plan" "PlanSuscripcion" NOT NULL DEFAULT 'base',
    "estado" "EstadoSuscripcion" NOT NULL DEFAULT 'activa',
    "renuevaEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "aforo" INTEGER NOT NULL,
    "plazasOcupadas" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'confirmada',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "portada" TEXT,
    "publicadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_recibidos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "asunto" TEXT NOT NULL,
    "ferrariModelo" TEXT,
    "mensaje" TEXT NOT NULL,
    "atendido" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_recibidos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "socios_email_key" ON "socios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "socios_stripeCustomerId_key" ON "socios"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_socioId_key" ON "suscripciones"("socioId");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_stripeSubscriptionId_key" ON "suscripciones"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_slug_key" ON "eventos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_eventoId_socioId_key" ON "inscripciones"("eventoId", "socioId");

-- CreateIndex
CREATE UNIQUE INDEX "noticias_slug_key" ON "noticias"("slug");

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
