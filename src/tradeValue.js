// pool is an array of stocks
// pool = ['aapl','msft','googl']

// orders is history of trade long/short stocks within the pool

const limitShort = 1 // set the maximum percentage of available cash used to short is 100%

// Trade is about trading stocks within current pool at specific date
// values is evaluation of previous date, value could be negative (short, borrowing stock with immediate sell, profit when return shares later at lower price)
// value = amount * price at each day, amount is integer
// date is the day of trading action, using close price by default
class Trade {
    constructor(pool, values, amounts, cash, date, prices) {
        this.pool = pool // ex. ['aapl','msft','googl']
        this.values = values // ex. {"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 12345.67,"msft": 22345.67,"googl": 32345.67}}
        this.amounts = amounts // ex. {"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 12345,"msft": 22345,"googl": 32345}}
        this.cash = cash // ex. {"date": "2018-12-31T00:00:00.000Z", "cash": 100000}
        this.date = date // ex. new Date("2018-12-31")
        this.prices = prices // ex. {"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 123,"msft": 223,"googl": 323}}
        this.trades = [] // records of finished trade
    }

    long(ticker, percentage) { // buy a stock, from percentage of cash value
        if (percentage > 0 && percentage <= 1) {
            let amount = Math.floor(cash * percentage / prices[ticker])
            if (amount > 0) {
                this.cash -= amount * prices[ticker]
                this.amounts[ticker] += amount
                this.values[ticker] += amount * prices[ticker]
                this.trades.push({ticker: ticker, amount: amount, type: 'long', date: this.date})
            }
        }
    }

    short(ticker, percentage) { // short a stock, from percentage of cash value
        if (percentage > 0 && percentage <= limitShort) {
            let amount = Math.floor(cash * percentage / prices[ticker])
            if (amount > 0) {
                this.cash += amount * prices[ticker]
                this.amounts[ticker] -= amount
                this.values[ticker] -= amount * prices[ticker]
                this.trades.push({ticker: ticker, amount: amount, type: 'short', date: this.date})
            }
        }
    }

    longs(tickers, percentages) { // long a sequence of stocks, one after one
        for (i=0;i<tickers.length;i++) {
            this.long(tickers[i], percentages[i])
        }
    }

    shorts(tickers, percentages) { // short a sequence of stocks, one after one
        for (i=0;i<tickers.length;i++) {
            this.short(tickers[i], percentages[i])
        }
    }

    eval() { // evaluation of portfolio value at specific date
        return {'pool': pool, 'values': values, 'amounts': amounts, 'cash': cash, 'date': date, 'prices': prices}
    }
}

// Fund is the class representing data of portofolio
class Fund {
    constructor(pool, values, amounts, cash, dateBegin, prices) {
        this.pool = pool // ex. ['aapl','msft','googl']
        this.values = values // ex. [{"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 12345.67,"msft": 22345.67,"googl": 32345.67}}, ...]
        this.amounts = amounts // ex. [{"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 12345,"msft": 22345,"googl": 32345}}, ...]
        this.cash = cash // ex. [{"date": "2018-12-31T00:00:00.000Z", "cash": 100000}, ...]
        this.dateBegin = dateBegin // ex. new Date("2018-12-31")
        this.prices = prices // ex. [{"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 123,"msft": 223,"googl": 323}}, ...]
    }

}



let d = new Date("2018-12-31T00:00:00.000Z")
let h = {'d': d.getFullYear().toString()+'-'+d.getMonth().toString()+'-'+d.getDay().toString()}
console.log(h)
console.log(new Date(h.d))