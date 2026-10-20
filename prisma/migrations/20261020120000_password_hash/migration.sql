-- Acceso con contrasena ademas del enlace por correo. Nulo = solo enlace.
ALTER TABLE "socios" ADD COLUMN "password_hash" TEXT;
