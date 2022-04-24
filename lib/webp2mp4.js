const  fetch  =  membutuhkan ( 'pengambilan simpul' )
const  FormData  =  memerlukan ( 'form-data' )
const  {  JSDOM  }  =  memerlukan ( 'jsdom' )

 fungsi  async webp2mp4 ( sumber )  {
  biarkan  formulir  =  FormData baru 
  let  isUrl  =  typeof  source  ===  'string'  &&  / https?: \/ \/ / . tes ( sumber )
  bentuk . tambahkan ( 'new-image-url' ,  isUrl ? sumber : '' )
  bentuk . append ( 'new-image' ,  isUrl ? '' : source ,  'image.webp' )
  let  res  =  menunggu  fetch ( 'https://s6.ezgif.com/webp-to-mp4' ,  {
    metode : 'POST' ,
    tubuh : bentuk
  } )
  biarkan  html  =  menunggu  res . teks ( )
  biarkan  { dokumen }  =  JSDOM baru  ( html ) . jendela
  biarkan  form2  =  FormData baru 
  misalkan  obj  =  { }
  untuk  ( biarkan  masukan  dari  dokumen . querySelectorAll ( 'form input [nama]' ) )  {
    obj [ masukan . nama ]  =  masukan . nilai
    bentuk2 . tambahkan ( masukan . nama ,  masukan . nilai )
  }
  let  res2  =  menunggu  fetch ( 'https://ezgif.com/webp-to-mp4/'  +  obj . file ,  {
    metode : 'POST' ,
    tubuh : bentuk2
  } )
  biarkan  html2  =  menunggu  res2 . teks ( )
  let  {  document : document2  }  =  new  JSDOM ( html2 ) . jendela
  kembali  baru  URL ( document2 . querySelector ( 'div # keluaran> p.outfile> video> sumber' ) . src ,  res2 . url ) . toString ( )
}

 fungsi  async webp2png ( sumber )  {
  biarkan  formulir  =  FormData baru 
  let  isUrl  =  typeof  source  ===  'string'  &&  / https?: \/ \/ / . tes ( sumber )
  bentuk . tambahkan ( 'new-image-url' ,  isUrl ? sumber : '' )
  bentuk . append ( 'new-image' ,  isUrl ? '' : source ,  'image.webp' )
  let  res  =  menunggu  fetch ( 'https://s6.ezgif.com/webp-to-png' ,  {
    metode : 'POST' ,
    tubuh : bentuk
  } )
  biarkan  html  =  menunggu  res . teks ( )
  biarkan  { dokumen }  =  JSDOM baru  ( html ) . jendela
  biarkan  form2  =  FormData baru 
  misalkan  obj  =  { }
  untuk  ( biarkan  masukan  dari  dokumen . querySelectorAll ( 'form input [nama]' ) )  {
    obj [ masukan . nama ]  =  masukan . nilai
    bentuk2 . tambahkan ( masukan . nama ,  masukan . nilai )
  }
  let  res2  =  menunggu  fetch ( 'https://ezgif.com/webp-to-png/'  +  obj . file ,  {
    metode : 'POST' ,
    tubuh : bentuk2
  } )
  biarkan  html2  =  menunggu  res2 . teks ( )
  let  {  document : document2  }  =  new  JSDOM ( html2 ) . jendela
  kembali  baru  URL ( document2 . querySelector ( 'div # keluaran> p.outfile> img' ) . src ,  res2 . url ) . toString ( )
}

if  ( membutuhkan . main  ===  modul )  {
  // TODO: Tes
  webp2mp4 ( 'https://mathiasbynens.be/demo/animated-webp-supported.webp' ) . lalu ( konsol . kesalahan )
  webp2png ( 'https://mathiasbynens.be/demo/animated-webp-supported.webp' ) . lalu ( konsol . kesalahan )
}  lain  {
  modul . ekspor  =  { webp2mp4 , webp2png }
}
