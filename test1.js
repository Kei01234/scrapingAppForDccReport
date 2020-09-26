const jsdom=require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs");

var html=fs.readFileSync("html/test3Mixed.html", "utf-8");

//htmlファイルの読み込み
var dom=new JSDOM(html);


var x=dom.window.document.querySelectorAll().map(e=>e.value);

console.log(x)

