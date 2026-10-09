// Los mismos campos que el formulario de presupuesto de seguro de la web
// anterior del club, en el mismo orden.
export const CAMPOS = [
  { bloque: 'Datos del tomador', campos: [
    ['nombre', 'Nombre y apellidos', true],
    ['dni', 'DNI', true],
    ['telefono', 'Teléfono', true],
    ['email', 'Correo electrónico', true],
    ['nacimiento', 'Fecha de nacimiento', false],
    ['carnet', 'Fecha carnet', false],
  ] },
  { bloque: 'Datos del vehículo', campos: [
    ['modelo', 'Modelo', false],
    ['potencia', 'Potencia', false],
    ['cilindrada', 'Cilindrada', false],
    ['matricula', 'Matrícula', false],
    ['primeraMatriculacion', 'Fecha 1ª Matriculación', false],
    ['extras', 'Extras e importes de los mismos', false],
  ] },
  { bloque: 'Seguro actual', campos: [
    ['poliza', 'Nº Póliza actual de este u otro vehículo', false],
    ['matriculaAsegurada', 'Matrícula asegurada', false],
    ['anios', 'Años asegurados', false],
    ['coberturas', 'Coberturas', false],
    ['observaciones', 'Observaciones', false],
  ] },
] as const;
