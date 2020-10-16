const fs = require("fs");
const { JSDOM } = require("jsdom");

const filename = "sample";
const separator = "\t";
const xyPattern = /^x: (.*), y: (.*)$/;

const html = fs.readFileSync(`${filename}.html`);
const { window } = new JSDOM(html);
// see also: https://stackoverflow.com/questions/3772290/css-selector-that-applies-to-elements-with-two-classes
const notes = [...window.document.querySelectorAll(".note:not(.new)")];

const header = ["memo", "x", "y"].join(separator);
const contents = notes.map((note) => {
  const memo = note.childNodes[2].value;
  const [, x, y] = note.childNodes[3].textContent.match(xyPattern);
  return [memo, x, y].join(separator);
});

const tsv = [header, ...contents].join("\n");
fs.writeFileSync(`${filename}.tsv`, tsv);
