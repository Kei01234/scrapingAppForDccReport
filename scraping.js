const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const separator = "\t";
const pointPattern = /^.*: (.*), .*: (.*)$/;

function printError(message) {
  console.log(`error: ${message}`);
  process.exit(1);
}

if (!process.argv[2]) printError("入力ファイルを指定してください");
if (!fs.existsSync(process.argv[2])) printError("入力ファイルが存在しません");
const { name } = path.parse(process.argv[2]);
const html = fs.readFileSync(process.argv[2]);
const { document } = new JSDOM(html).window;

let info, contents;
try {
  const points = document.querySelector(".graph-info").innerHTML.split("<br>");
  info = points.map((point) => point.match(pointPattern).slice(1, 3));
  const notes = [...document.querySelectorAll(".note:not(.new)")];
  contents = notes.map((note) => {
    const memo = note.childNodes[2].value;
    const [, x, y] = note.childNodes[3].textContent.match(pointPattern) || [];
    return [memo, x, y].join(separator);
  });
} catch {
  printError("入力ファイルの解析に失敗しました");
}

const header = ["memo", "x", "y"].join(separator);
const tsv = [header, ...contents].join("\n");
try {
  fs.writeFileSync(`${name}.tsv`, tsv);
  console.log(info.flat().join(" "));
} catch {
  printError("結果の出力に失敗しました");
}
