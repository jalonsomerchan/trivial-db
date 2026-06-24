# Trivial DB

Base de datos abierta de preguntas para juegos tipo trivial.

La idea del repositorio es mantener las preguntas como JSON individuales y crear índices por categorías para poder cargarlas de forma sencilla desde juegos, webs, apps o scripts.

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
| `category` | `string` | Sí | Categoría principal. Debe coincidir con un archivo en `categories/`. |
| `subcategories` | `array<string>` | No | Subcategorías o agrupaciones más específicas dentro de la categoría principal. |
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

El nombre del archivo debe coincidir con el `id` de la categoría:

```txt
categories/historia.json
```

### Ejemplo de categoría completa

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
      "name": "Siglo XX",
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

### Ejemplo de categoría mínima

```json
{
  "id": "historia",
  "name": "Historia",
  "questions": [
    "q-000001",
    "q-000015",
    "q-000032"
  ]
}
```

### Campos de una categoría

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `id` | `string` | Sí | Identificador de la categoría. Debe coincidir con el nombre del archivo. |
| `name` | `string` | Sí | Nombre visible de la categoría. |
| `description` | `string` | No | Descripción breve de la categoría. |
| `icon` | `string` | No | Emoji, icono o identificador visual de la categoría. |
| `color` | `string` | No | Color recomendado para interfaces. Preferiblemente en hexadecimal. |
| `questions` | `array<string>` | Sí | Lista de IDs de preguntas incluidas en la categoría. |
| `subcategories` | `array<object>` | No | Índices secundarios dentro de la categoría. |
| `stats` | `object` | No | Estadísticas precalculadas para uso rápido en frontend. |
| `updated_at` | `string` | No | Fecha de última actualización en formato `YYYY-MM-DD`. |

## Convenciones

- Los IDs de preguntas deben seguir el formato `q-000001`, `q-000002`, `q-000003`, etc.
- Los IDs de categorías deben escribirse en minúsculas, sin espacios y usando guiones cuando sea necesario. Ejemplo: `cine-tv`.
- Cada pregunta debe aparecer en el índice de su categoría principal.
- El campo `category` de cada pregunta debe apuntar a una categoría existente.
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
