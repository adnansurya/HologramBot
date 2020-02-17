const functions = require('firebase-functions');
const Telegraf = require('telegraf')
let config = require('./env.json');

if(Object.keys(functions.config()).length){
  config = functions.config();
}

var path = require('path');
var serviceAccount = require(path.join(__dirname, 'hologrambot-c845b-firebase-adminsdk-b65tj-34eaa21083.json'));

var admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hologrambot-c845b.firebaseio.com",
  databaseAuthVariableOverride: null
});
const db = admin.database();

function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}



const bot = new Telegraf(config.service.telegram_key);
bot.start((ctx) => ctx.reply('Selamat Datang'))
bot.command('hadir', (ctx) => {
  let username = ctx.from.username;
  let nama = ctx.from.first_name + " " + ctx.from.last_name; 
  db.ref('hadir/'+username).set({
    nama : nama,
    status : 'Hadir'
  }); 
  // console.log(getDateTime());
  // console.log(JSON.stringify(ctx.from));
  
  ctx.reply(nama + ' (@' + username + ') sedang berada di Ambeso.');

});

bot.command('keluar', (ctx) => {
  let username = ctx.from.username;
  let nama = ctx.from.first_name + " " + ctx.from.last_name;
  db.ref('hadir/'+username).update({
    nama : nama,
    status : 'Keluar'
  }); 
  
  ctx.reply(nama + ' (@' + username + ') sedang keluar, dan akan kembali ke Ambeso.');

});

bot.command('pulang', (ctx) => {
  let username = ctx.from.username;
  let nama = ctx.from.first_name + " " + ctx.from.last_name; 
  db.ref('hadir/' +username).remove( function(error) {
    if (error) {
        console.log(error);        
    } else {
        console.log('Berhasil menghapus data');        
    }
  }); 

  ctx.reply(nama + ' (@' + username + ') sudah pulang.');

});

bot.command('cek', (ctx) => {
  let members = "";
  db.ref('hadir').once('value').then(function(snapshot){
    snapshot.forEach(function(childSnap){
      let member = childSnap.val();
      let username = childSnap.key;
      let nama = member.nama;
      let status = member.status;
      let satu = nama + ' (@' + username + ') - ' + status + "\n";
      members += satu;      
    });
    if(members == ""){
      ctx.reply('Belum ada orang di Ambeso');
    }else{
      ctx.reply('Anggota yang hadir:\n' + members);
    }
    
  });
});

//bot.launch()
exports.helloBot = functions.https.onRequest(
  (req, res) => bot.handleUpdate(req.body, res)
)

