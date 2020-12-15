const path=require('path');
const fs=require('fs');
const { JSDOM } = require("jsdom");

const separator = "\t";
const pointPattern = /^.*: (.*), .*: (.*)$/;

function printError(message) {
    console.log(`error: ${message}`);
    process.exit(1);
}

//judge==0の時学籍番号を取得judge==1の時名前を取得
function returnValue(text, judge) {
    if (judge==0) {
        var startPlace=text.indexOf("value")+7;
    }
    else {
        var startPlace=text.lastIndexOf("value")+7;
    }
    var endPlace=text.indexOf('"', startPlace);

    return text.substring(startPlace, endPlace);
}

//コマンド入力の不備をここで解決
try {
    var dirPath=process.argv[2];
    var files=fs.readdirSync(dirPath, {withFileTypes:true});
} catch {
    printError("入力ディレクトリを指定してください");
}

var htmlFilePaths=[];
//<!DOCTYPE html>の文字列があるファイルのパスをhtmlFilePathsに追加していく
for (const file of files) {
    try {
        var filePath=dirPath+"/"+file.name;
        var html=fs.readFileSync(filePath, "utf-8");
        if (html.indexOf("<!DOCTYPE html>")!==-1) {
            htmlFilePaths.push(filePath);
        }
    } catch {
        console.log("ファイルを読み込めません");
    }
}

var tsv, contentArray=[];

for (const htmlFilePath of htmlFilePaths) {
    html=fs.readFileSync(htmlFilePath, "utf-8");
    //htmlをjsdomで使える形式で読み込んでいる
    const { document } = new JSDOM(html).window;

    //tsvファイルの名前に使用するためにhtml内から指名と学籍番号を取得する

    let info, content,pointNumber=0;
    try {
        const notes = [...document.querySelectorAll(".note:not(.new)")];
        var noteHerderList=document.querySelectorAll(".note-header"), number=0;
        //contentは配列になっている！
        content = notes.map((note) => {
            //下2行でメモ内容と座標を取得してる
            const memo = note.childNodes[2].value;
            const [, x, y] = note.childNodes[3].textContent.match(pointPattern) || [];
            const noteHeader=document.q
            if (noteHerderList[number].textContent==="メモ" || noteHerderList[number].textContent==="Note") {
                number++;
                return [
                    returnValue(html, 0),
                    returnValue(html, 1),
                    memo.replace(/[\n\t]/g, " "),
                    null,
                    x,
                    y
                ].join(separator);
            }
            number++;
            pointNumber++;
            return [
                returnValue(html, 0),
                returnValue(html, 1),
                memo.replace(/[\n\t]/g, " "),
                pointNumber,
                x,
                y
            ].join(separator);
        });

        contentArray.push(content.join("\n"));
    } catch {
        console.log(`${htmlFilePath}の情報を正常に取得できませんでした`)
    }
    //下の2行をよく確認する
    var header = ["学籍番号", "名前", "メモ内容", "点番号", "x", "y"].join(separator);
    tsv = [header, ...contentArray].join("\n");
}

try {
    //下の行を編集してhtmlが入っているディレクトリ名をファイル名として使うようにする
    var dirName=process.argv[2];
    fs.writeFileSync(dirName+"Table.tsv", tsv);
} catch {
    printError("結果の出力に失敗しました");
}

