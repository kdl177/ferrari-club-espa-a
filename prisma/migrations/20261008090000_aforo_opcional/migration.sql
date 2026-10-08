-- El club no publica el aforo de todos sus eventos: sin aforo, la inscripcion no tiene tope.
ALTER TABLE "eventos" ALTER COLUMN "aforo" DROP NOT NULL;
