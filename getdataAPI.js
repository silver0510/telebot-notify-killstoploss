'use strict'
var request = require('request');
var CoinCandleInfo = require('./coinInfo');
const url_CoinsName = 'https://api.binance.com/api/v3/ticker/price';
const url_CoinCandleInfo = 'https://api.binance.com/api/v1/klines';

function getAsyncListCoinName(){
    return new Promise((resolve,reject)=>{
        request.get(url_CoinsName,(error, response,body)=>{
            if(error) return;
            let jsons = JSON.parse(body);
            //let coinsName = jsons.map(coin => coin.symbol);
            let coinsName =[];
            for (let index = 0; index < jsons.length; index++) {
                let symbol = jsons[index].symbol;
                if(symbol.substring(symbol.length -3) != 'BNB'){
                    coinsName.push(symbol);
                }
            }
            resolve(coinsName);
        })
    });
}

//interval: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
function getAsyncCoinInfo(symbol,interval,limit = 500,startTime = 0, endTime = 0){  
    let url = `${url_CoinCandleInfo}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    if(startTime !== 0){
        url += `&startTime=${startTime}`
    }

    if(endTime !== 0){
        url += `&endTime=${endTime}`
    }

    return new Promise((resolve,reject)=>{
        request.get(url,(error, response,body)=>{
            if(error) return;
            let jsons = JSON.parse(body);
            let coinCandleInfo = jsons.map(info =>{
                let openTime = convertTimestampToLocaleString(info[0]);
                let closeTime = convertTimestampToLocaleString(info[6]);
                return new CoinCandleInfo(symbol,interval,openTime,info[1],info[2],info[3],info[4],info[5],closeTime);
            });
	    /*let coinCandleInfo = [];
	    for (let index = 0; index < jsons.length; index++) {
                let info = jsons[index];
                let openTime = convertTimestampToLocaleString(info[0]);
                let closeTime = convertTimestampToLocaleString(info[6]);
		        coinCandleInfo.push(new CoinCandleInfo(symbol,interval,openTime,info[1],info[2],info[3],info[4],info[5],closeTime));
            }*/
            resolve(coinCandleInfo);
        })
    });
}

function convertTimestampToLocaleString(timestamp){
    let date = new Date(timestamp);
    return date.toLocaleString();
}

//*************************************** */
module.exports.getAsyncListCoinName = getAsyncListCoinName;
module.exports.getAsyncCoinInfo = getAsyncCoinInfo;



