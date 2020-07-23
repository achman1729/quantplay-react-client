// a simple model of portfolio building
// portfolio is a combination of stocks, with specified proportions
// proportions could be changed by trade
// each new trade should be after all previously existing trades
// trade could be long(buy) or short(sell), within limits of current position at the day


const limitShort = 1 // set the maximum percentage of (cash + holding) used to short is 100%

// Trade is about trading stocks within current pool at specific date
// values is evaluation of stock with close price, value could be negative (short, borrowing stock with immediate sell, profit when return shares later at lower price)
// value = amount * price at each day, amount is integer
class Trade {
    constructor(pool, values, amounts, csh, date, prices) {
        this.pool = pool // ex. ['aapl','msft','googl']
        this.values = values // ex. {date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 12345.67, "msft": 22345.67, "googl": 32345.67}}
        this.amounts = amounts // ex. {date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 12345, "msft": 22345, "googl": 32345}}
        this.cash = csh // ex. {date: new Date("2018-12-31T00:00:00.000Z"), close: 100000}
        this.date = date // ex. new Date("2018-12-31")
        this.prices = prices // ex. {date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 123, "msft": 223, "googl": 323}}
        this.trades = [] // records of finished trade
    }

    long(ticker, percentage) { // buy a stock, from percentage of cash value
        if (percentage > 0 && percentage <= 1) {
            let amount = Math.floor(this.cash.close * percentage / this.prices.close[ticker])
            if (amount > 0) {
                this.cash.close -= amount * this.prices.close[ticker]
                this.amounts.close[ticker] += amount
                this.values.close[ticker] += amount * this.prices.close[ticker]
                this.trades.push({ticker: ticker, amount: amount, type: 'long', date: this.date})
            } else {
                console.log("Not enough cash to long for this percentage of cash value")
            }
        }
    }

    short(ticker, percentage) { // short a stock, from percentage of (cash + values.close[ticker]) value
        if (percentage > 0 && percentage <= limitShort) {
            let amount = Math.floor((this.cash.close + this.values.close[tinker]) * percentage / prices[ticker])
            if (amount > 0) {
                let valShort = amount * this.prices.close[ticker]              
                this.cash.close += valShort
                this.amounts.close[ticker] -= amount
                this.values.close[ticker] -= valShort
                this.trades.push({ticker: ticker, amount: amount, type: 'short', date: this.date})
            } else {
                console.log("Not enough to short for this percentage of (cash + holding) value")
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
        return {pool: this.pool, values: this.values, amounts: this.amounts, cash: this.cash, date: this.date, prices: this.prices, trades: this.trades}
    }
}

// Fund is the class representing data of portofolio
// Fund contains sorted arrays of information
// prices, values, amounts, cash are arrays of objects, in ascending order of date, with the same arrays of date property
// trades is sorted array of objects, in the form as of Trade.eval().trades
class Fund {
    constructor(pool, values, amounts, cash, dateBegin, prices, trades) {
        this.pool = pool // ex. ['aapl','msft','googl']
        this.values = values // ex. [{date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 12345.67, "msft": 22345.67, "googl": 32345.67}}, ...]
        this.amounts = amounts // ex. [{date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 12345, "msft": 22345, "googl": 32345}}, ...]
        this.cash = cash // ex. [{date: new Date("2018-12-31T00:00:00.000Z"), close: 100000}, ...]
        this.dateBegin = dateBegin // ex. new Date("2018-12-31")
        this.prices = prices // ex. [{date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 123, "msft": 223, "googl": 323}}, ...]
        this.trades = trades // ex. [{ticker: "aapl", amount: 100, type: 'short', date: new Date("2019-1-4")}, ...]
    }

    // for initialize a fund with specified amounts in a concise way
    buildStatic(p, amts, csh, dtBegin, prices) { 
        // here amts (for amounts) is of form {ticker1: Number, ticker2: Number ...}
        // csh (for cash) is a Number
        // assume prices is big enough containing dtBegin and sorted
        let vs = [] // to the values in Fund constructor
        let as = [] // to the amounts in Fund constructor
        let cs = [] // to the cash in Fund constructor

        for(let i = prices.findIndex((ele) => ele.date == dtBegin); i < prices.length; i++) {
            cs.push({date: prices[i].date, close: csh})
            let itemAmt = {date: prices[i].date, close: {}}
            let itemV = {date: prices[i].date, close: {}}
            for (let [s, a] in Object.entries(amts[i])) {
                itemAmt.close[s] = a
                itemV.close[s] = a * prices[i][s]
            }
            as.push(itemA)
            vs.push(itemV)
        }
        let fundInit = new Fund(p, vs, as, cs, dtBegin, prices, [])
        return fundInit
    }

    // trade at day t, if t is after the last of trades which have already taken place
    addTrade(t, tickersLong, percentagesLong, tickersShort, percentagesShort) {
        if (t > this.trades[this.trades.length - 1].date) {
            let ind = this.cash.findIndex((item) => item.date == t)
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

    val(t) { // evaluate totals of major categories at date t, ex. return {val: 12345, valLong: 10345, valShort: -2000, cash: 4000}
        let total = 0
        let totalLong = 0
        let totalShort = 0

        let ind = this.prices.findIndex((item) => item.date == t)
        for (let [k, v] in Object.entries(this.values[ind].close)) {
            if (v > 0) {
                totalLong += v
                total += v
            } else {
                totalShort += v
                total += v + this.cash[ind].close
            }
        }
        total +=  this.cash[ind].close
        return {val: total, valLong: totalLong, valShort: totalShort, cash: this.cash[ind].close}
    }

    total(t) { // evaluate total at date t, ex. return 12345
        let total = 0
        let ind = this.prices.findIndex((item) => item.date == t)
        for (let [k, v] in Object.entries(this.values[ind].close)) { 
            total += v
        }
        total +=  this.cash[ind].close
        return total
    }

}

// experiment along :)
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
// let obj = {}
// obj['d1'] = {close: {}}
// obj['d1'].close['a1'] = 1
// obj['d1'].close['a2'] = 2
// console.log(obj)

// let obj = {d1: "abc", close: {}}
// obj.close['t1'] = 123
// obj.close['t2'] = 234
// t3='t3'
// obj.close[t3] = 345
// console.log(obj)