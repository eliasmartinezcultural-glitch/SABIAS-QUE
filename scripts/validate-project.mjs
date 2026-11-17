import fs from "node:fs";
import vm from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");
const questionSource = read("questions.js");
const sourceNotes = read("FUENTES.md");

try { new Function(app); } catch (error) { errors.push("app.js no tiene sintaxis válida: " + error.message); }

const questionWindow = {};
try {
  vm.runInNewContext(questionSource, { window: questionWindow });
} catch (error) {
  errors.push("questions.js no puede ejecutarse: " + error.message);
}

const questions = questionWindow.CHANAR_QUESTIONS;
check(Array.isArray(questions) && questions.length > 0, "El banco de preguntas está vacío o no es un array.");

if (Array.isArray(questions)) {
  const ids = questions.map((question) => question.id);
  check(new Set(ids).size === ids.length, "Hay identificadores de pregunta repetidos.");

  const categories = new Set(
    [...html.matchAll(/data-category="([^"]+)"/g)]
      .flatMap((match) => match[1].split(","))
  );

  for (const question of questions) {
    check(/^CH-\d{3}$/.test(question.id || ""), "Identificador inválido: " + question.id);
    check(typeof question.statement === "string" && question.statement.trim(), question.id + ": falta la afirmación.");
    check(typeof question.explanation === "string" && question.explanation.trim(), question.id + ": falta la explicación.");
    check(typeof question.answer === "boolean", question.id + ": answer debe ser true o false.");
    check(typeof question.category === "string" && question.category.trim(), question.id + ": falta categoría.");
    check(categories.has(question.category), question.id + ": categoría sin botón temático: " + question.category);
    check(/^https:\/\//.test(question.sourceUrl || ""), question.id + ": la fuente debe tener una URL HTTPS.");
    check(typeof question.sourceTitle === "string" && question.sourceTitle.trim(), question.id + ": falta el título de la fuente.");

    if (question.image) {
      check(/^https:\/\//.test(question.image.src || ""), question.id + ": la imagen debe tener URL HTTPS.");
      check(Boolean(question.image.alt && question.image.alt.trim()), question.id + ": la imagen no tiene texto alternativo.");
      check(Boolean(question.image.caption && question.image.caption.trim()), question.id + ": la imagen no tiene epígrafe.");
    }
  }
}

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
check(new Set(htmlIds).size === htmlIds.length, "Hay atributos id duplicados en index.html.");

const missingIds = [...new Set(
  [...app.matchAll(/\$\(["']([^"']+)["']\)/g)]
    .map((match) => match[1])
    .filter((id) => !htmlIds.includes(id))
)];
check(missingIds.length === 0, "app.js referencia IDs que no existen: " + missingIds.join(", "));

const classNames = new Set([
  ...[...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/)),
  ...[...app.matchAll(/className\s*=\s*["']([^"']+)["']/g)].flatMap((match) => match[1].split(/\s+/)),
  ...[...app.matchAll(/classList\.(?:add|remove|toggle)\(["']([^"']+)["']/g)].map((match) => match[1])
].filter(Boolean));
const missingClasses = [...classNames].filter((name) => !css.includes("." + name));
check(missingClasses.length === 0, "Faltan estilos para clases usadas: " + missingClasses.join(", "));

const assetPaths = new Set([
  ...[...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((match) => match[1]),
  ...[...app.matchAll(/["'](assets\/[^"']+)["']/g)].map((match) => match[1])
]);
for (const asset of assetPaths) check(fs.existsSync(asset), "No existe el recurso: " + asset);

const braceBalance = (css.match(/{/g) || []).length - (css.match(/}/g) || []).length;
check(braceBalance === 0, "styles.css tiene llaves desbalanceadas.");

for (const asset of ["styles.css", "questions.js", "app.js"]) {
  const escaped = asset.replace(".", "\\.");
  check(new RegExp(escaped + "\\?v=[^\\" ]+").test(html), "Falta versión de caché para " + asset + " en index.html.");
}

check(html.includes('href="FUENTES.md"') && fs.existsSync("FUENTES.md"), "Falta el acceso al documento de fuentes.");
check(sourceNotes.trim().length > 0, "FUENTES.md está vacío.");

if (errors.length) {
  console.error("FALLARON " + errors.length + " controles:");
  for (const error of errors) console.error(" - " + error);
  process.exitCode = 1;
} else {
  console.log("OK · JavaScript válido");
  console.log("OK · " + questions.length + " preguntas con identificadores únicos, fuentes y categorías válidas");
  console.log("OK · IDs HTML y referencias JavaScript");
  console.log("OK · clases, imágenes y recursos locales");
  console.log("OK · CSS y versiones de caché");
  console.log("OK · documentación editorial");
}
