const jsdom=require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs");
const iconv = require('iconv-lite')


var html=fs.readFileSync("html/test3Mixed.html", "utf-8");

//htmlファイルの読み込み
var dom=new JSDOM(html);

var coordinateList=[];
var coordinateDictionary={};
var noteList=[];
var titleList=[];
var coordinateMemoList=[];
var simpleMemoDictionary=[]
var noteList=[];



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



//点のx値とy値を取得する
var pointsInformation=dom.window.document.querySelectorAll(".note-footer");

//note-footerクラスの数がグラフの点の数になっているため、その数を取得する
var numberOfPoits=pointsInformation.length;


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



//点の注釈かただのメモかを選別する
var noteContentList=dom.window.document.querySelectorAll(".note-content");
var headerList=dom.window.document.querySelectorAll(".note-header");

//点の注釈とただのメモの内容を両方とも抽出する
for (let i = 0; i < noteContentList.length; i++) {
    var noteContent=noteContentList[i].textContent;

    noteList.push(noteContent);
}

//その点の番号と"Note"という文字列を取得
for (let i = 0; i < headerList.length; i++) {
    var header=headerList[i].textContent;

    titleList.push(header);
}


//座標のメモのリストを作成
for (let i = 0; i < titleList.length; i++) {
    if (titleList[i]!="Note") {
        coordinateMemoList.push(noteList[i]);
    }
}


//座標とその座標のメモの辞書を作成
var numberOfList=coordinateList.length+coordinateList.length/2;
var x=0;
var y=0;

for (let i = 0; i<numberOfList; i++) {
    if (i%3==0) {
        var num=i/3+1;
        coordinateDictionary["x"+num]=coordinateList[x];
        x++;
    }

    else if (i%3==1) {
        var num=i/3+2/3;
        coordinateDictionary["y"+num]=coordinateList[x];
        x++;
    }

    else {
        var num=i/3+1/3;
        //その点のメモを入れる
        coordinateDictionary["#"+num]=coordinateMemoList[y]
        y++;
    }
}

console.log(coordinateDictionary)


//普通のメモの辞書を作成
var z=1;
for (let i = 0; i < titleList.length; i++) {
    if (titleList[i]=="Note") {
        simpleMemoDictionary["Note"+z]=noteList[i];
        z++;
    }
}

console.log(simpleMemoDictionary);


//tsvファイルに書き込む処理を追加
console.log(coordinateDictionary["x1"])
console.log(num)

var elementalTsv=id+"\t"+name+"\t";


//1行1列目のtsv文字列を作成
for (let i = 1; i <= num; i++) {
    if (i==1) {
        var descriveTsv="学籍番号\t名前\t曲線上の点の数\t";
    }
    
    descriveTsv+="点"+i+"\t";
}

//実際の座標のtsv文字列を作成
for (let i = 1; i <= num; i++) {
    if (i==1) {
        var coordinateTsv=elementalTsv+numberOfPoits+"\t";   
    }

    coordinateTsv+="("+coordinateDictionary["x"+i]+","+coordinateDictionary["y"+i]+")\t";

    //その座標に関するメモがいらない場合は下の1行をコメントアウトする
    //coordinateTsv+=coordinateDictionary["#"+i]+"\t";
}

//tsv文字列の完成品
var tsv=descriveTsv+"\n"+coordinateTsv+"\n";

console.log(tsv);



// Shift-jisで書き出しする
fs.writeFileSync( "tsv/scraping.tsv" , "" )                  // 空のファイルを書き出す
let fd    = fs.openSync( "tsv/scraping.tsv", "w")            // ファイルを書き込み専用モードで開く
let buf   = iconv.encode( tsv , "UTF-16LE" , { addBOM: true } )  // 書き出すデータをUTF-16リトルエンディアンBOM付きに変換して、バッファとして書き出す
fs.write( fd , buf , 0 , buf.length , (err, written, buffer) => {  //  バッファをファイルに書き込む
  if(err){
  	throw err
  }
  else {
  	console.log("ファイルが正常に書き出しされました")
  }
})
