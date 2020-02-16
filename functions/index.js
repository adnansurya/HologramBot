const functions = require('firebase-functions');
var serviceAccount = require(path.join(__dirname, 'mksrobotics-firebase-adminsdk-ns7lo-cfe0562851.json'));

var admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mksrobotics.firebaseio.com",
  databaseAuthVariableOverride: null
});
const db = admin.database();

const Telegraf = require('telegraf')

const bot = new Telegraf('815919277:AAHmfFlO_MySXLKTW8a7NYbt7YLaxIzAJRo')
bot.command('siapa', (ctx) => {
    ctx.reply('Hello');
    console.log(JSON.stringify(ctx.from.username));
});
bot.launch()

