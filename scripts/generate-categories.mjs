import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const questionsDir = path.join(rootDir, 'questions');
const categoriesDir = path.join(rootDir, 'categories');

const REQUIRED_DIFFICULTIES = ['easy', 'medium', 'hard'];

function toTitle(id) {
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function sortIds(a, b) {
  return a.localeCompare(b, 'es', { numeric: true });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`JSON inválido en ${path.relative(rootDir, filePath)}: ${error.message}`);
  }
}

async function readQuestions() {
  if (!(await exists(questionsDir))) {
    return [];
  }

  const files = (await fs.readdir(questionsDir))
    .filter((file) => file.endsWith('.json'))
    .sort(sortIds);

  const questions = [];

  for (const file of files) {
    const filePath = path.join(questionsDir, file);
    const question = await readJson(filePath);
    const expectedId = path.basename(file, '.json');

    if (question.id !== expectedId) {
      throw new Error(`El id de ${file} debe ser "${expectedId}".`);
    }

    if (typeof question.question !== 'string' || question.question.trim() === '') {
      throw new Error(`La pregunta ${question.id} debe tener un campo "question" no vacío.`);
    }

    if (typeof question.category !== 'string' || question.category.trim() === '') {
      throw new Error(`La pregunta ${question.id} debe tener una categoría válida.`);
    }

    if (!Array.isArray(question.answers)) {
      throw new Error(`La pregunta ${question.id} debe tener un array "answers".`);
    }

    if (question.answers.some((answer) => Object.prototype.hasOwnProperty.call(answer, 'id'))) {
      throw new Error(`La pregunta ${question.id} tiene respuestas con campo "id". Las respuestas no deben tener id.`);
    }

    const correctAnswers = question.answers.filter((answer) => answer.correct === true);
    if (correctAnswers.length !== 1) {
      throw new Error(`La pregunta ${question.id} debe tener exactamente una respuesta correcta.`);
    }

    questions.push(question);
  }

  return questions;
}

async function readExistingCategories() {
  const categories = new Map();

  if (!(await exists(categoriesDir))) {
    return categories;
  }

  const files = (await fs.readdir(categoriesDir)).filter((file) => file.endsWith('.json'));

  for (const file of files) {
    const category = await readJson(path.join(categoriesDir, file));
    const id = path.basename(file, '.json');
    categories.set(id, category);
  }

  return categories;
}

function buildCategory(categoryId, questions, existingCategory) {
  const sortedQuestions = [...questions].sort((a, b) => sortIds(a.id, b.id));
  const questionIds = sortedQuestions.map((question) => question.id);

  const stats = {
    total: sortedQuestions.length,
    easy: 0,
    medium: 0,
    hard: 0,
  };

  for (const question of sortedQuestions) {
    if (REQUIRED_DIFFICULTIES.includes(question.difficulty)) {
      stats[question.difficulty] += 1;
    }
  }

  const existingSubcategories = new Map(
    Array.isArray(existingCategory?.subcategories)
      ? existingCategory.subcategories.map((subcategory) => [subcategory.id, subcategory])
      : [],
  );

  const subcategoryQuestions = new Map();

  for (const question of sortedQuestions) {
    if (!Array.isArray(question.subcategories)) {
      continue;
    }

    for (const subcategoryId of question.subcategories) {
      if (typeof subcategoryId !== 'string' || subcategoryId.trim() === '') {
        continue;
      }

      if (!subcategoryQuestions.has(subcategoryId)) {
        subcategoryQuestions.set(subcategoryId, []);
      }

      subcategoryQuestions.get(subcategoryId).push(question.id);
    }
  }

  const subcategories = [...subcategoryQuestions.entries()]
    .sort(([a], [b]) => sortIds(a, b))
    .map(([subcategoryId, ids]) => {
      const existingSubcategory = existingSubcategories.get(subcategoryId) ?? {};
      return {
        id: subcategoryId,
        name: existingSubcategory.name || toTitle(subcategoryId),
        questions: [...new Set(ids)].sort(sortIds),
      };
    });

  const category = {
    id: categoryId,
    name: existingCategory?.name || toTitle(categoryId),
  };

  if (existingCategory?.description) {
    category.description = existingCategory.description;
  }

  if (existingCategory?.icon) {
    category.icon = existingCategory.icon;
  }

  if (existingCategory?.color) {
    category.color = existingCategory.color;
  }

  category.questions = questionIds;

  if (subcategories.length > 0) {
    category.subcategories = subcategories;
  }

  category.stats = stats;
  category.updated_at = new Date().toISOString().slice(0, 10);

  return category;
}

async function removeStaleCategories(generatedCategoryIds) {
  if (!(await exists(categoriesDir))) {
    return;
  }

  const files = (await fs.readdir(categoriesDir)).filter((file) => file.endsWith('.json'));

  for (const file of files) {
    const categoryId = path.basename(file, '.json');
    if (!generatedCategoryIds.has(categoryId)) {
      await fs.unlink(path.join(categoriesDir, file));
      console.log(`Eliminada categoría obsoleta: categories/${file}`);
    }
  }
}

async function main() {
  const questions = await readQuestions();
  const existingCategories = await readExistingCategories();
  const questionsByCategory = new Map();

  for (const question of questions) {
    if (!questionsByCategory.has(question.category)) {
      questionsByCategory.set(question.category, []);
    }

    questionsByCategory.get(question.category).push(question);
  }

  await fs.mkdir(categoriesDir, { recursive: true });

  const generatedCategoryIds = new Set(questionsByCategory.keys());

  for (const [categoryId, categoryQuestions] of [...questionsByCategory.entries()].sort(([a], [b]) => sortIds(a, b))) {
    const category = buildCategory(categoryId, categoryQuestions, existingCategories.get(categoryId));
    const filePath = path.join(categoriesDir, `${categoryId}.json`);
    await fs.writeFile(filePath, `${JSON.stringify(category, null, 2)}\n`, 'utf8');
    console.log(`Generada categoría: categories/${categoryId}.json`);
  }

  await removeStaleCategories(generatedCategoryIds);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
