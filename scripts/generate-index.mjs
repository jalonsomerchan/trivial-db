import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const questionsDir = path.join(rootDir, 'questions');
const indexPath = path.join(rootDir, 'index.json');

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

async function main() {
  if (!(await exists(questionsDir))) {
    await fs.writeFile(indexPath, '[]\n', 'utf8');
    console.log('Generado index.json vacío porque no existe questions/.');
    return;
  }

  const files = (await fs.readdir(questionsDir))
    .filter((file) => file.endsWith('.json'))
    .sort(sortIds);

  const index = [];
  const ids = new Set();

  for (const file of files) {
    const filePath = path.join(questionsDir, file);
    const question = await readJson(filePath);
    const expectedId = path.basename(file, '.json');

    if (question.id !== expectedId) {
      throw new Error(`El id de ${file} debe ser "${expectedId}".`);
    }

    if (ids.has(question.id)) {
      throw new Error(`ID duplicado: ${question.id}`);
    }

    if (typeof question.question !== 'string' || question.question.trim() === '') {
      throw new Error(`La pregunta ${question.id} debe tener un campo "question" no vacío.`);
    }

    ids.add(question.id);

    index.push({
      id: question.id,
      question: question.question,
    });
  }

  index.sort((a, b) => sortIds(a.id, b.id));

  await fs.writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log(`Generado index.json con ${index.length} preguntas.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
