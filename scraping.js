const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const separator = "\t";
const pointPattern = /^.*: (.*), .*: (.*)$/;

function printError(message) {
  console.log(`error: ${message}`);
  process.exit(1);
}

if (!process.argv[2]) printError("");
if (!fs.existsSync(process.argv[2])) printError("");
const html = fs.readFileSync(process.argv[2]);
const { name } = path.parse(process.argv[2]);

const { window } = new JSDOM(html);
const points = window.document
  .querySelector(".graph-info")
  .innerHTML.split("<br>");
const info = points.map((point) => point.match(pointPattern).slice(1, 3));
const notes = [...window.document.querySelectorAll(".note:not(.new)")];
const contents = notes.map((note) => {
  const memo = note.childNodes[2].value;
  const [, x, y] = note.childNodes[3].textContent.match(pointPattern);
  return [memo, x, y].join(separator);
});

const header = ["memo", "x", "y"].join(separator);
const tsv = [header, ...contents].join("\n");

try {
  fs.writeFileSync(`${name}.tsv`, tsv);
  console.log(info.flat().join(" "));
} catch {
  printError("");
}
