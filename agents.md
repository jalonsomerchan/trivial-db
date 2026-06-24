# Agents

Instrucciones para agentes o automatizaciones que trabajen en este repositorio.

## Objetivo del repositorio

Este repositorio contiene una base de datos de preguntas para juegos tipo trivial.

Las preguntas se guardan como JSON individuales en `questions/`. Los índices de categorías en `categories/` y el índice global `index.json` se generan automáticamente a partir de esas preguntas.

## Estructura obligatoria

```txt
questions/
  q-000001.json
  q-000002.json

categories/
  historia.json
  geografia.json

index.json

scripts/
  generate-categories.mjs
  generate-index.mjs

.github/workflows/
  generate-categories.yml
  generate-index.yml
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
- El campo `category` debe ser un identificador en minúsculas, sin espacios y con guiones si hace falta.
- `subcategories`, si existe, debe ser un array de identificadores en minúsculas, sin espacios y con guiones si hace falta.
- Usar fechas en formato `YYYY-MM-DD`.
- Formatear los JSON con 2 espacios.

## Categorías generadas

Los archivos de `categories/` no se mantienen manualmente pregunta a pregunta.

Se generan con:

```bash
node scripts/generate-categories.mjs
```

El script lee todos los archivos `questions/*.json` y genera un archivo por cada categoría encontrada en el campo `category`.

Ejemplo de salida:

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

Reglas:

- No añadir manualmente preguntas al array `questions` de una categoría.
- Para cambiar la categoría de una pregunta, cambiar el campo `category` de esa pregunta.
- Para cambiar subcategorías, cambiar el campo `subcategories` de la pregunta.
- El script conserva metadatos existentes de categoría: `name`, `description`, `icon` y `color`.
- El script recalcula siempre `questions`, `subcategories`, `stats` y `updated_at`.
- Si una categoría ya no tiene preguntas, el script elimina su archivo JSON.

## Índice global generado

El archivo `index.json` se genera con:

```bash
node scripts/generate-index.mjs
```

Formato:

```json
[
  {
    "id": "q-000001",
    "question": "¿En qué año comenzó la Primera Guerra Mundial?"
  }
]
```

Reglas:

- `index.json` es generado: no editarlo manualmente.
- Solo debe contener `id` y `question` de cada pregunta.
- Sirve para consultar rápidamente si una pregunta existe sin cargar todos los JSON completos.

## GitHub Actions

Hay dos workflows:

```txt
.github/workflows/generate-categories.yml
.github/workflows/generate-index.yml
```

### Generate categories

Ejecuta:

```bash
node scripts/generate-categories.mjs
```

Se lanza cuando cambian:

```txt
questions/**/*.json
scripts/generate-categories.mjs
.github/workflows/generate-categories.yml
```

Si hay cambios, hace commit automático de `categories/`.

### Generate question index

Ejecuta:

```bash
node scripts/generate-index.mjs
```

Se lanza cuando cambian:

```txt
questions/**/*.json
scripts/generate-index.mjs
.github/workflows/generate-index.yml
```

Si hay cambios, hace commit automático de `index.json`.

## Flujo recomendado para agentes

Antes de aceptar cambios en preguntas:

```bash
node scripts/generate-categories.mjs
node scripts/generate-index.mjs
```

Después, comprobar que solo han cambiado los archivos esperados:

- Nuevas preguntas o preguntas editadas en `questions/`.
- Categorías generadas en `categories/`.
- Índice generado en `index.json`.

## Prompt para añadir nuevas preguntas

Usa este prompt cuando quieras pedir a una IA que añada nuevas preguntas al repositorio:

```txt
Trabaja sobre el repositorio `[jalonsomerchan/trivial-db](https://github.com/jalonsomerchan/trivial-db)`.

Objetivo: añadir nuevas preguntas para juegos tipo trivial.

Antes de modificar nada:
1. Lee completo `agents.md` y respeta todas sus reglas.
2. Revisa `index.json` para comprobar si ya existen preguntas iguales o muy parecidas.
3. Revisa los archivos existentes en `questions/` para calcular el siguiente ID disponible con formato `q-000001`, `q-000002`, etc.

Tarea:
- Crea una pregunta nueva por cada archivo JSON dentro de `questions/`.
- No edites manualmente `categories/` ni `index.json`, salvo para regenerarlos con los scripts indicados.
- Cada archivo debe llamarse exactamente igual que el campo `id`, por ejemplo `questions/q-000123.json`.
- Todas las preguntas deben estar en español salvo que se indique otro idioma.
- Todas las preguntas deben tener una sola respuesta correcta.
- No añadas campo `type`.
- No añadas campo `id` dentro de las respuestas.
- Cada respuesta debe tener solo `text` y `correct`.
- Usa preferiblemente 4 respuestas por pregunta.
- Añade una explicación breve en `explanation`.
- Añade fuentes fiables en `sources` siempre que sea posible.
- Usa `status: "published"` para preguntas listas para usarse.
- Usa `difficulty` con uno de estos valores: `easy`, `medium`, `hard`.
- Usa `category`, `subcategories` y `tags` con identificadores en minúsculas, sin espacios y con guiones si hace falta.
- Usa fechas en formato `YYYY-MM-DD`.
- Formatea todos los JSON con 2 espacios.

Formato obligatorio de cada pregunta:

{
  "id": "q-000123",
  "status": "published",
  "language": "es",
  "category": "categoria-principal",
  "subcategories": ["subcategoria"],
  "difficulty": "medium",
  "question": "Texto de la pregunta",
  "answers": [
    {
      "text": "Respuesta correcta",
      "correct": true
    },
    {
      "text": "Respuesta incorrecta 1",
      "correct": false
    },
    {
      "text": "Respuesta incorrecta 2",
      "correct": false
    },
    {
      "text": "Respuesta incorrecta 3",
      "correct": false
    }
  ],
  "explanation": "Explicación breve de la respuesta correcta.",
  "sources": [
    {
      "title": "Nombre de la fuente",
      "url": "https://example.com"
    }
  ],
  "tags": ["tag-uno", "tag-dos"],
  "created_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD"
}

Después de añadir o modificar preguntas:
1. Ejecuta `node scripts/generate-categories.mjs`.
2. Ejecuta `node scripts/generate-index.mjs`.
3. Comprueba que `categories/` se ha generado a partir de las preguntas.
4. Comprueba que `index.json` solo contiene `id` y `question`.
5. Comprueba que no hay IDs duplicados.
6. Comprueba que cada pregunta tiene exactamente una respuesta con `"correct": true`.
7. Comprueba que ninguna respuesta tiene campo `id`.
8. Comprueba que ninguna pregunta tiene campo `type`.
```

## Validaciones recomendadas

Antes de aceptar nuevas preguntas o cambios:

- Que el JSON es válido.
- Que no hay IDs duplicados.
- Que cada pregunta tiene exactamente una respuesta correcta.
- Que ninguna respuesta tiene campo `id`.
- Que ninguna pregunta tiene campo `type`.
- Que cada `id` coincide con el nombre del archivo.
- Que cada pregunta tiene `category`.
- Que `index.json` solo contiene `id` y `question`.
