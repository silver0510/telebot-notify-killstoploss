class CoinCandleInfo {
    constructor(symbol,canleType,Open_Time,Open,High,Low,Close,Volume,Close_Time) {
        // always initialize all instance properties
        this.symbol = symbol
        this.canleType = canleType
        this.openTime = Open_Time   //0
        this.openPrice = Open;      //1
        this.highPrice = High;      //2
        this.lowPrice = Low;        //3
        this.closePrice = Close;    //4
        this.volume = Volume;       //5
        this.closeTime = Close_Time //6
    }

    toString(){
        return `Coin: #${this.symbol}
Candle Type: ${this.canleType}
Open time: ${this.openTime}
Open price: ${this.openPrice}
High price: ${this.highPrice}               
Low price: ${this.lowPrice}
Close price: ${this.closePrice}
Volume: ${this.volume}
Close time: ${this.closeTime}`
    }
}

module.exports = CoinCandleInfo; 