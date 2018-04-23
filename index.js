'use strict'
var LISTID = require('./listTelegramID').LISTID;
var CronJob = require('cron').CronJob;
const getData = require('./getdataAPI');
const telebot = require('./telebot')
const checkBTC = require('./checkbtcprice');
const KILLSTOPLOSS_PERCENT = 0.053;//giá low thấp hơn n% so vs giá đóng cửa
const DIFFERENCE_PERCENT = 0.0168;//Phần trăm chênh lệch của nên trước so vs nến check

async function main(interval) {  //interval: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    let listCoinsName = await getData.getAsyncListCoinName();
    if(listCoinsName.length > 0){
        listCoinsName.forEach(async(element) => {
        let coinsCandles = await getData.getAsyncCoinInfo(element,interval,3)
        //chỉ kiểm tra nến trước đó bỏ qua nến hiện tại
        //nghĩa là kiểm tra phần tử 0(nến trước nữa) và 1(nến trước) của mảng bỏ phần tử 2 (nến hiện tại)
        let pre_prev_Candle = coinsCandles[0]; //phần tử 0(nến trước nữa)
        let prev_Candle = coinsCandles[1]; // phân tử 1(nến trước)
        let upLimit = parseFloat(pre_prev_Candle.closePrice)*(1 + DIFFERENCE_PERCENT)
        let downLimit = parseFloat(pre_prev_Candle.closePrice)*(1 - DIFFERENCE_PERCENT)
        if((parseFloat(prev_Candle.closePrice) >= downLimit)&&(parseFloat(prev_Candle.closePrice) <= upLimit)){
            let stoploss_Killzone = parseFloat(prev_Candle.closePrice) * (1-KILLSTOPLOSS_PERCENT); //giá low thấp hơn n% so vs giá đóng cửa
            if((parseFloat(prev_Candle.lowPrice)) <= stoploss_Killzone){
                console.log(prev_Candle.toString());
                telebot.announcementToListID(LISTID,prev_Candle);
            }   
        }              
        });
    }
}
var myInt = setInterval(checkBTC.compareBTCPrice, 60000);
var checkCandle30p = new CronJob({ //'0 2,32 * * * *'
    cronTime: '0 2,32 * * * *',
    onTick: function() {    
        telebot.tg.onMaster(async () => {  //telebot.tg.onMaster cái này để chỉ thực hiện 1 lần lệnh, nếu k có nó sẽ gởi số lần theo số workers
            console.log('Check time: ' + new Date().toLocaleString());
            console.log('Candle type: 30m')
            main('30m');
            
        })
    },
    start: true,
    timeZone: 'Europe/London'
  });
checkCandle30p.start();

var checkCandle1h = new CronJob({ //0 2 * * * *
    cronTime: '10 2 * * * *',
    onTick: function() {    
        telebot.tg.onMaster(async () => {
            console.log('Check time: ' + new Date().toLocaleString());
            console.log('Candle type: 1h')
            main('1h');
        })
    },
    start: true,
    timeZone: 'Europe/London'
  });
checkCandle1h.start();

var checkCandle4h = new CronJob({ //0 2 0,4,8,12,16,20 * * *
    cronTime: '20 2 0,4,8,12,16,20 * * *',
    onTick: function() {    
        telebot.tg.onMaster(async () => {
            console.log('Check time: ' + new Date().toLocaleString());
            console.log('Candle type: 4h')
            main('4h');
        })
    },
    start: true,
    timeZone: 'Europe/London'
  });
checkCandle4h.start();

