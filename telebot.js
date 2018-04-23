'use strict'
var CoinCandleInfo = require('./coinInfo');
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram('578549943:AAGvS7aa1Fk6b8KjnI85FhE_G1-lyBsBxro',{workers: 1})

//gởi thông tin coin bị sl cho 1 người
module.exports.announcement = function announcement(id,candleInfo){
    let msg = `Coin này có thể đã bị kill stoploss\n\Thông tin coin:
${candleInfo.toString()}`;
    //tg.onMaster(() => {
    //telebot.announcement(472988814,'áad')
    tg.api.sendMessage(id,msg);
    //})
}

//gởi thông tin coin bị sl cho 1 nhóm
module.exports.announcementToListID = function announcement(listId,candleInfo){
    let msg = `Coin này có thể đã bị kill stoploss\n\Thông tin coin:
${candleInfo.toString()}
*****************************`;
    //tg.onMaster(() => {
    //telebot.announcement(472988814,'áad')
    listId.forEach(id => {
        tg.api.sendMessage(id,msg);
    });   
    //})
}

//gởi thông tin check giá btc cho 1 nhóm
module.exports.announcementCheckBTCToListID = function announcement(listId,content){
    //tg.onMaster(() => {
    //telebot.announcement(472988814,'áad')
    listId.forEach(id => {
        tg.api.sendMessage(id,content);
    });   
    //})
}

class PingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    //hàm này lấy gởi ID của user cho họ
    getIdHandler($) {
        if($.message.text.substring(0,1) === '/'){
            $.sendMessage('Your chat ID: ' + $.message.chat.id) 
        }      
    }

    get routes() {
        return {
            'cmd': 'getIdHandler',
        }
    }
}
 
tg.router
    .when(
        new TextCommand('/id', 'cmd'),
        new PingController()
    )

module.exports.tg = tg;

