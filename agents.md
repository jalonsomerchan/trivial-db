# Agents

Instrucciones para agentes o automatizaciones que trabajen en este repositorio.

## Objetivo del repositorio

Este repositorio contiene una base de datos de preguntas para juegos tipo trivial.

Las preguntas se guardan como JSON individuales en `questions/` y las categorías se guardan como índices en `categories/`.

## Estructura obligatoria

```txt
questions/
  q-000001.json
  q-000002.json

categories/
  historia.json
  geografia.json
```

## Formato de pregunta

Cada pregunta debe guardarse en `questions/{id}.json`.

Ejemplo:

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

## Reglas para preguntas

- No añadir campo `type`.
- Todas las preguntas son de una sola opción correcta.
- El campo `id` de la pregunta debe coincidir con el nombre del archivo.
- Las respuestas no deben tener `id`.
- Cada respuesta debe tener solo `text` y `correct`.
- Debe existir exactamente una respuesta con `"correct": true`.
- El resto de respuestas deben llevar `"correct": false`.
- Se recomiendan 4 respuestas por pregunta.
- El campo `category` debe apuntar a una categoría existente en `categories/`.
- La pregunta debe estar incluida en el array `questions` de su categoría.
- Usar fechas en formato `YYYY-MM-DD`.
- Formatear los JSON con 2 espacios.

## Formato de categoría

Cada categoría debe guardarse en `categories/{id}.json`.

Ejemplo:

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

## Reglas para categorías

- El campo `id` de la categoría debe coincidir con el nombre del archivo.
- Los IDs de categoría deben escribirse en minúsculas, sin espacios y usando guiones cuando sea necesario.
- El array `questions` contiene IDs de preguntas, no rutas de archivo.
- Si se usan `subcategories`, cada subcategoría debe tener `id`, `name` y `questions`.
- `stats` puede usarse como caché para frontends, pero debe mantenerse coherente con las preguntas reales.

## Validaciones recomendadas

Antes de aceptar nuevas preguntas o categorías, comprobar:

- Que el JSON es válido.
- Que no hay IDs duplicados.
- Que cada pregunta tiene exactamente una respuesta correcta.
- Que ninguna respuesta tiene campo `id`.
- Que ninguna pregunta tiene campo `type`.
- Que todas las categorías referenciadas existen.
- Que cada pregunta aparece en su índice de categoría.
- Que los IDs incluidos en categorías existen en `questions/`.
