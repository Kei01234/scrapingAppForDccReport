const fs    = require('fs')
const iconv = require('iconv-lite')
const tsv   = `果物\t色\t価格\nりんご\t赤\t300\nバナナ\t黄\t100`

// Shift-jisで書き出しする
fs.writeFileSync( "tsv/test2.tsv" , "" )                  // 空のファイルを書き出す
let fd    = fs.openSync( "tsv/test2.tsv", "w")            // ファイルを書き込み専用モードで開く
let buf   = iconv.encode( tsv , "UTF-16LE" , { addBOM: true } )  // 書き出すデータをUTF-16リトルエンディアンBOM付きに変換して、バッファとして書き出す
fs.write( fd , buf , 0 , buf.length , (err, written, buffer) => {  //  バッファをファイルに書き込む
  if(err){
  	throw err
  }
  else {
  	console.log("ファイルが正常に書き出しされました")
  }
})
