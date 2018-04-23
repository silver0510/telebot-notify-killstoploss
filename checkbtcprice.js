var LISTID_BTC = require('./listTelegramID').LISTID_BTC;
var request = require("request");
const telebot = require('./telebot')

const API_BIFINEX = "https://api.bitfinex.com/v1/pubticker/btcusd";
const API_BINANCE = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
const API_BITTREX = "https://bittrex.com/api/v1.1/public/getticker?market=usdt-btc";
const DIFF = 5.87;//Lệch bao nhiêu phần % 5.87

function getData(link){
	return new Promise(function(resolve, reject) {
		request(link, (error, response, body) => {
    	if (error) return reject(error);
    	if(link	== API_BIFINEX){
    		resolve(JSON.parse(body).last_price);
    	}
    	if(link	== API_BINANCE){
    		resolve(JSON.parse(body).price);
    	}
    	if(link	== API_BITTREX){
    		resolve(JSON.parse(body).result.Last);
        }    
	}); 
	});
}

async function compareBTCPrice(){
	//get data
	var Bifinex_BTC_Price = await getData(API_BIFINEX);
	var Binance_BTC_Price = await getData(API_BINANCE);
	var Bittrex_BTC_Price = await getData(API_BITTREX);

	var UpLimit = Bifinex_BTC_Price*(100+DIFF)/100
	var DownLimit = Bifinex_BTC_Price*(100-DIFF)/100

	if(Binance_BTC_Price<DownLimit || Binance_BTC_Price > UpLimit)
	{
        //Báo sàn binance lệch nhìu
        let content = `Giá BTC sàn Binance và Bifinex chênh lệch lớn\n\Giá BTC Bifinex: ${Bifinex_BTC_Price}\n\Giá BTC Binance: ${Binance_BTC_Price}`;
        telebot.announcementCheckBTCToListID(LISTID_BTC,content);
	}

	if(Bittrex_BTC_Price<DownLimit || Bittrex_BTC_Price > UpLimit)
	{
        //Báo sàn bittrex lệch nhìu
        let content = `Giá BTC sàn Bittrex và Bifinex chênh lệch nhìu\n\Giá BTC Bifinex:${Bifinex_BTC_Price}\n\Giá BTC Bittrex: ${Bittrex_BTC_Price}`;
        telebot.announcementCheckBTCToListID(LISTID_BTC,content);
	}
}

module.exports.compareBTCPrice = compareBTCPrice;