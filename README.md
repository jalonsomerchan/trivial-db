# Trivial DB

Base de datos abierta de preguntas para juegos tipo trivial.

La idea del repositorio es mantener las preguntas como JSON individuales, generar automáticamente los índices por categorías y crear un índice global ligero para poder consultar rápidamente qué preguntas existen.

## Estructura del repositorio

```txt
questions/
  q-000001.json
  q-000002.json
  q-000003.json

categories/
  historia.json
  geografia.json
  ciencia.json
  deportes.json
  cine-tv.json

index.json

scripts/
  generate-categories.mjs
  generate-index.mjs

.github/workflows/
  generate-categories.yml
  generate-index.yml
```

## Preguntas

Cada pregunta vive en un archivo JSON independiente dentro de `questions/`.

El nombre del archivo debe coincidir con el `id` de la pregunta:

```txt
questions/q-000001.json
```

### Ejemplo de pregunta

```json
{
  "id": "q-000001",
  "status": "published",
  "language": "es",
  "category": "historia",
  "subcategories": ["siglo-xx", "europa"],
  "difficulty": "medium",
  "question": "¿En qué año comenzó la Primera Guerra Mundial?",
  "answers": [
    {
      "text": "1914",
      "correct": true
    },
    {
      "text": "1918",
      "correct": false
    },
    {
      "text": "1939",
      "correct": false
    },
    {
      "text": "1905",
      "correct": false
    }
  ],
  "explanation": "La Primera Guerra Mundial comenzó en 1914 tras el asesinato del archiduque Francisco Fernando.",
  "sources": [
    {
      "title": "Wikipedia - Primera Guerra Mundial",
      "url": "https://es.wikipedia.org/wiki/Primera_Guerra_Mundial"
    }
  ],
  "tags": ["guerra", "siglo-xx", "europa"],
  "created_at": "2026-06-24",
  "updated_at": "2026-06-24"
}
```

### Campos de una pregunta

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `id` | `string` | Sí | Identificador único de la pregunta. Debe coincidir con el nombre del archivo. Ejemplo: `q-000001`. |
| `status` | `string` | Sí | Estado editorial de la pregunta. Valores recomendados: `draft`, `reviewed`, `published`, `deprecated`. |
| `language` | `string` | Sí | Idioma de la pregunta en formato corto. Ejemplo: `es`. |
| `category` | `string` | Sí | Categoría principal. Se usa para generar automáticamente el archivo correspondiente en `categories/`. |
| `subcategories` | `array<string>` | No | Subcategorías o agrupaciones más específicas dentro de la categoría principal. Se usan para generar índices secundarios dentro de cada categoría. |
| `difficulty` | `string` | Sí | Dificultad de la pregunta. Valores recomendados: `easy`, `medium`, `hard`. |
| `question` | `string` | Sí | Texto de la pregunta. |
| `answers` | `array<object>` | Sí | Listado de respuestas posibles. Solo una respuesta puede tener `correct: true`. |
| `explanation` | `string` | No | Explicación breve para mostrar después de responder. |
| `sources` | `array<object>` | No | Fuentes usadas para verificar la pregunta. |
| `tags` | `array<string>` | No | Etiquetas libres para búsquedas, filtros o generación de partidas. |
| `created_at` | `string` | Sí | Fecha de creación en formato `YYYY-MM-DD`. |
| `updated_at` | `string` | Sí | Fecha de última actualización en formato `YYYY-MM-DD`. |

### Respuestas

Cada objeto dentro de `answers` debe tener esta forma:

```json
{
  "text": "1914",
  "correct": true
}
```

Reglas:

- No se usa `id` en las respuestas.
- Todas las preguntas son de respuesta única.
- Cada pregunta debe tener exactamente una respuesta correcta.
- La respuesta correcta se marca con `"correct": true`.
- El resto de respuestas deben llevar `"correct": false`.
- Para trivial clásico se recomiendan 4 respuestas por pregunta.

## Categorías

Cada categoría vive en un archivo JSON dentro de `categories/`.

Los archivos de `categories/` se generan automáticamente leyendo todas las preguntas de `questions/`. No hace falta añadir manualmente cada pregunta al índice de su categoría.

El nombre del archivo coincide con el `id` de la categoría:

```txt
categories/historia.json
```

### Ejemplo de categoría generada

```json
{
  "id": "historia",
  "name": "Historia",
  "description": "Preguntas sobre historia universal, acontecimientos, personajes y fechas relevantes.",
  "icon": "🏛️",
  "color": "#b45309",
  "questions": [
    "q-000001",
    "q-000015",
    "q-000032"
  ],
  "subcategories": [
    {
      "id": "siglo-xx",
      "name": "Siglo Xx",
      "questions": ["q-000001", "q-000015"]
    },
    {
      "id": "europa",
      "name": "Europa",
      "questions": ["q-000001", "q-000032"]
    }
  ],
  "stats": {
    "total": 3,
    "easy": 1,
    "medium": 1,
    "hard": 1
  },
  "updated_at": "2026-06-24"
}
```

### Campos de una categoría

| Campo | Tipo | Generado | Descripción |
| --- | --- | --- | --- |
| `id` | `string` | Sí | Identificador de la categoría. Sale del campo `category` de las preguntas. |
| `name` | `string` | Sí | Nombre visible de la categoría. Si el archivo ya existía, se conserva. Si no, se genera desde el `id`. |
| `description` | `string` | Parcial | Descripción breve de la categoría. Si existe, se conserva al regenerar. |
| `icon` | `string` | Parcial | Emoji, icono o identificador visual de la categoría. Si existe, se conserva al regenerar. |
| `color` | `string` | Parcial | Color recomendado para interfaces. Si existe, se conserva al regenerar. |
| `questions` | `array<string>` | Sí | Lista de IDs de preguntas incluidas en la categoría. |
| `subcategories` | `array<object>` | Sí | Índices secundarios calculados desde `subcategories` de las preguntas. |
| `stats` | `object` | Sí | Estadísticas precalculadas por total y dificultad. |
| `updated_at` | `string` | Sí | Fecha de última generación en formato `YYYY-MM-DD`. |

### Generar categorías en local

```bash
node scripts/generate-categories.mjs
```

El script:

- Lee todos los archivos `questions/*.json`.
- Agrupa las preguntas por `category`.
- Genera un archivo por categoría en `categories/{category}.json`.
- Calcula `questions`, `subcategories` y `stats`.
- Conserva metadatos existentes de la categoría: `name`, `description`, `icon` y `color`.
- Elimina categorías obsoletas que ya no tengan preguntas.

## Índice global de preguntas

El archivo `index.json` se genera automáticamente con todas las preguntas disponibles.

Sirve para consultar rápidamente si una pregunta existe sin tener que cargar todos los JSON completos.

Su formato es un array con solo `id` y `question`:

```json
[
  {
    "id": "q-000001",
    "question": "¿En qué año comenzó la Primera Guerra Mundial?"
  },
  {
    "id": "q-000002",
    "question": "¿Cuál es la capital de Bélgica?"
  }
]
```

### Generar índice en local

```bash
node scripts/generate-index.mjs
```

El script:

- Lee todos los archivos `questions/*.json`.
- Comprueba que el `id` coincide con el nombre del archivo.
- Comprueba que no hay IDs duplicados.
- Crea `index.json` con objetos `{ "id", "question" }`.
- Si no existe `questions/`, genera un array vacío.

## GitHub Actions

Hay dos acciones automáticas:

### Generate categories

Archivo:

```txt
.github/workflows/generate-categories.yml
```

Se ejecuta cuando cambian:

```txt
questions/**/*.json
scripts/generate-categories.mjs
.github/workflows/generate-categories.yml
```

También puede lanzarse manualmente con `workflow_dispatch`.

Esta acción ejecuta:

```bash
node scripts/generate-categories.mjs
```

Y, si hay cambios, hace commit automático de `categories/`.

### Generate question index

Archivo:

```txt
.github/workflows/generate-index.yml
```

Se ejecuta cuando cambian:

```txt
questions/**/*.json
scripts/generate-index.mjs
.github/workflows/generate-index.yml
```

También puede lanzarse manualmente con `workflow_dispatch`.

Esta acción ejecuta:

```bash
node scripts/generate-index.mjs
```

Y, si hay cambios, hace commit automático de `index.json`.

## Convenciones

- Los IDs de preguntas deben seguir el formato `q-000001`, `q-000002`, `q-000003`, etc.
- Los IDs de categorías deben escribirse en minúsculas, sin espacios y usando guiones cuando sea necesario. Ejemplo: `cine-tv`.
- Cada pregunta debe indicar su categoría principal en `category`.
- No se deben actualizar manualmente los arrays `questions` de las categorías: los genera la acción.
- `index.json` es un archivo generado: no debe editarse manualmente.
- Las fechas deben escribirse en formato `YYYY-MM-DD`.
- Los JSON deben estar formateados con 2 espacios.
- No se debe añadir un campo `type`: todas las preguntas son de una sola opción correcta.

## Categorías iniciales recomendadas

```txt
historia
geografia
ciencia
arte-literatura
deportes
cine-tv
musica
entretenimiento
tecnologia
naturaleza
```
