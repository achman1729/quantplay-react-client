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
        for (let i = 0; i < tickers.length; i++) {
            this.long(tickers[i], percentages[i])
        }
    }

    shorts(tickers, percentages) { // short a sequence of stocks, one after one
        for (let i = 0; i < tickers.length; i++) {
            this.short(tickers[i], percentages[i])
        }
    }

    eval() { // evaluation of portfolio value at specific date
        return {pool: pool, values: values, amounts: amounts, cash: cash, date: date, prices: prices, trades: this.trades}
    }
}

// Fund is the class representing data of portofolio
class Fund {
    // assume sequences are sorted by date
    constructor(pool, values, amounts, cash, dateBegin, prices, trades) {
        this.pool = pool // ex. ['aapl','msft','googl']
        this.values = values // ex. [{"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 12345.67,"msft": 22345.67,"googl": 32345.67}}, ...]
        this.amounts = amounts // ex. [{"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 12345,"msft": 22345,"googl": 32345}}, ...]
        this.cash = cash // ex. [{"date": "2018-12-31T00:00:00.000Z", "cash": 100000}, ...]
        this.dateBegin = dateBegin // ex. new Date("2018-12-31")
        this.prices = prices // ex. [{"date": "2018-12-31T00:00:00.000Z", "close": {"aapl": 123,"msft": 223,"googl": 323}}, ...]
        this.trades = trades // ex. [{ticker: "aapl", amount: 100, type: 'short', date: new Date("2019-1-4")}, ...]
    }

    // trade at day t, if t is after the last of trades which have already taken place
    addTrade(t, tickersLong, percentagesLong, tickersShort, percentagesShort) {
        if (t > this.trades[this.trades.length - 1].date) {
            let ind = cash.findIndex((item) => item.date == t)
            let tradeT = new Trade(this.pool, this.values[ind], this.amounts[ind], cash[ind], t, prices[ind])
            tradeT.longs(tickersLong, percentagesLong)
            tradeT.short(tickersShort, percentagesShort)
            // update day t's data
            ev = tradeT.eval()
            this.values[ind] = ev.values
            this.amounts[ind] = ev.amount
            this.cash[ind] = ev.cash
            this.trades.push(ev.trades)

            // update data after day t
            for(let i = ind; i < this.cash.length; i++) {
                for (let [k, v] in Object.entries(this.values[i].close)) { // k is the tiker
                    this.value[i].close[k] = this.prices[i].close[k] * this.amounts[ind].close[k]
                    this.cash[i] = this.cash[ind]
                }
            }
        }
    }

}


// testing Date string format
// let d = new Date("2018-12-31T00:00:00.000Z")
// let h = {'d': d.getFullYear().toString()+'-'+d.getMonth().toString()+'-'+d.getDay().toString()}
// console.log(h)
// console.log(new Date(h.d))
// let d1 = new Date("2018-12-31T00:00:00.000Z")
// let d2 = new Date("2019-01-31T00:00:00.000Z")
// console.log(d1>d2)

// const array1 = [{a:2}, {'a':7}, {a:1}, {'a':5}, {'a':6}]
// console.log(array1.findIndex((element) => element.a > 4))