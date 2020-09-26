const jsdom=require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs");


var html=fs.readFileSync("html/test3Mixed.html", "utf-8");

//htmlファイルの読み込み
var dom=new JSDOM(html);



//学籍番号が格納されているvalue値の場所を取得
var valuePlace=html.indexOf("value")

//文字列valueのvから学籍番号の最初の数字までは7文字あるため
var idPlace1=valuePlace+7;

//学籍番号の最後にある"の位置を取得する
var idPlace2=html.indexOf('"', idPlace1);

//idPlace1からidPlace2までが学籍番号の位置になっているため
var id=Number(html.slice(idPlace1,idPlace2));

console.log(id)


//名前を取得するため、学籍番号より後ろのvalue値の場所を取得
var valuePlace=html.indexOf("value", idPlace2);

//文字列valueのvから学籍番号の最初の数字までは7文字あるため
var namePlace1=valuePlace+7;

//名前の最後にある"の位置を取得する
var namePlace2=html.indexOf('"', namePlace1);

//idPlace1からidPlace2までが名前の位置になっているため
var name=html.slice(namePlace1,namePlace2);

console.log(name);



//開始値、終了値、最小値、最大値の取得
var basicInformation=dom.window.document.querySelector(".graph-info").textContent;

//文字列を整える
var basicInformation=basicInformation.replace("開始値: ","");
var basicInformation=basicInformation.replace("終了値: ","");
var basicInformation=basicInformation.replace("最小値: ",", ");
var basicInformation=basicInformation.replace("最大値: ","");

//開始値、終了値、最小値、最大値のリストを作成
var basicInformationList=basicInformation.split(",");

//リストの要素の型を数値に変更
for (let i = 0; i < basicInformationList.length; i++) {
    basicInformationList.splice(i, 1, Number(basicInformationList[i]));
}

console.log(basicInformationList);

//開始値、終了値、最小値、最大値の辞書を作成
var basicInformationDictionary={
    開始値:basicInformationList[0],
    終了値:basicInformationList[1],
    最小値:basicInformationList[2],
    最大値:basicInformationList[3]
}
console.log(basicInformationDictionary);



var coordinateList=[];
var coordinateDictionary={};

//点のx値とy値を取得する
var pointsInformation=dom.window.document.querySelectorAll(".note-footer");

//note-footerクラスの数がグラフの点の数になっているため、その数を取得する
var numberOfPoits=pointsInformation.length;

console.log(numberOfPoits)

for (let i = 0; i < numberOfPoits; i++) {
    var pointsList=pointsInformation[i].textContent;

    //取得した座標をリストにしやすいように形を整える
    var pointsList=pointsList.replace("x: ","");
    var pointsList=pointsList.replace("y: ","");

    //取得した座標をリストにする
    var pointsList=pointsList.split(",");

    //pointsListを扱いやすいリストに変更
    for (let i = 0; i < pointsList.length; i++) {
        coordinateList.push(Number(pointsList[i]));
    } 
}

console.log(coordinateList)

//座標の辞書を作成
for (let i = 0; i< coordinateList.length; i++) {
    if (i%2==0) {
        var num=i/2+1;
        coordinateDictionary["x"+num]=coordinateList[i];
    }

    else {
        var num=i/2+0.5;
        coordinateDictionary["y"+num]=coordinateList[i];
    }
}

console.log(coordinateDictionary)



