CREATE SCHEMA IF NOT EXISTS cavallino;
SET search_path TO cavallino;

DROP TABLE IF EXISTS inscripciones CASCADE;
DROP TABLE IF EXISTS sesiones CASCADE;
DROP TABLE IF EXISTS solicitudes CASCADE;
DROP TABLE IF EXISTS eventos CASCADE;
DROP TABLE IF EXISTS socios CASCADE;

CREATE TABLE socios (
  id             SERIAL PRIMARY KEY,
  numero         TEXT NOT NULL UNIQUE,
  nombre         TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  modalidad      TEXT NOT NULL CHECK (modalidad IN ('Asociado','Titular','Clasicos')),
  zona           TEXT,
  vehiculo       TEXT,
  anio_vehiculo  INTEGER,
  alta           DATE NOT NULL DEFAULT CURRENT_DATE,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  junta          BOOLEAN NOT NULL DEFAULT FALSE,
  intentos       INTEGER NOT NULL DEFAULT 0,
  bloqueado_hasta TIMESTAMPTZ
);

CREATE TABLE eventos (
  id          SERIAL PRIMARY KEY,
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  fecha       DATE NOT NULL,
  lugar       TEXT,
  plazas      INTEGER NOT NULL DEFAULT 0,
  tipo        TEXT NOT NULL DEFAULT 'ruta'
);

CREATE TABLE inscripciones (
  id        SERIAL PRIMARY KEY,
  socio_id  INTEGER NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  creada    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (socio_id, evento_id)
);

CREATE TABLE sesiones (
  token    TEXT PRIMARY KEY,
  socio_id INTEGER NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
  creada   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira   TIMESTAMPTZ NOT NULL
);

CREATE TABLE solicitudes (
  id        SERIAL PRIMARY KEY,
  nombre    TEXT NOT NULL,
  email     TEXT NOT NULL,
  telefono  TEXT,
  modalidad TEXT,
  vehiculo  TEXT,
  anio      INTEGER,
  mensaje   TEXT,
  estado    TEXT NOT NULL DEFAULT 'pendiente'
            CHECK (estado IN ('pendiente','aprobada','rechazada')),
  creada    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resuelta  TIMESTAMPTZ,
  resuelta_por INTEGER REFERENCES socios(id) ON DELETE SET NULL,
  nota      TEXT
);

CREATE INDEX idx_sesiones_socio ON sesiones(socio_id);
CREATE INDEX idx_sesiones_expira ON sesiones(expira);
CREATE INDEX idx_inscripciones_socio ON inscripciones(socio_id);
CREATE INDEX idx_eventos_fecha ON eventos(fecha);
CREATE INDEX idx_socios_numero ON socios(numero);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado, creada DESC);
