const jsdom=require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs");

var html=fs.readFileSync("html/test3Mixed.html", "utf-8");

//htmlファイルの読み込み
var dom=new JSDOM(html);


console.log(0/3);
console.log(1/3);
console.log(2/3);

console.log(2/3+1/3);

