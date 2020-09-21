const jsdom=require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs");


var html=fs.readFileSync("html/test3Mixed.html", "utf-8");

//htmlファイルの読み込み
var dom=new JSDOM(html);

//開始値、終了値、最小値、最大値の取得
var basicInformation=dom.window.document.querySelector(".graph-info").textContent;

//文字列を整える
var basicInformation=basicInformation.replace("開始値: ","");
var basicInformation=basicInformation.replace("終了値: ","");
var basicInformation=basicInformation.replace("最小値: ",", ");
var basicInformation=basicInformation.replace("最大値: ","");

//開始値、終了値、最小値、最大値のリストを作成
var basicInformationList=basicInformation.split(",");
console.log(basicInformationList);

////開始値、終了値、最小値、最大値の辞書を作成
var basicInformationDictionary={
    開始値:Number(basicInformationList[0]),
    終了値:Number(basicInformationList[1]),
    最小値:Number(basicInformationList[2]),
    最大値:Number(basicInformationList[3])
}
console.log(basicInformationDictionary)



//note-footerクラスの数がグラフの点の数になっているため、その数を取得する
var numberOfPoits=dom.window.document.querySelectorAll(".note-footer").length;

console.log(numberOfPoits);

//点のx値とy値を取得する
var pointsList=dom.window.document.querySelectorAll(".note-footer");

for (let i = 0; i < numberOfPoits; i++) {
    console.log(pointsList[i].textContent);
    
}

