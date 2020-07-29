// a simple model of portfolio building
// portfolio is a combination of stocks, with specified proportions
// proportions could be changed by trade
// each new trade should be after all previously existing trades
// trade could be long(buy) or short(sell), within limits of current position at the day

const clone = require('rfdc')()

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

    short(tic, percentage) { // short a stock, from percentage of (cash + values.close[ticker]) value
        if (percentage > 0 && percentage <= limitShort) {
            let amount = Math.floor((this.cash.close + this.values.close[tic]) * percentage / this.prices.close[tic])
            if (amount > 0) {
                let valShort = amount * this.prices.close[tic]              
                this.cash.close += valShort
                this.amounts.close[tic] -= amount
                this.values.close[tic] -= valShort
                this.trades.push({ticker: tic, amount: amount, type: 'short', date: this.date})
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

    shorts(tics, percentages) { // short a sequence of stocks, one after one
        for (let i = 0; i < tics.length; i++) {
            this.short(tics[i], percentages[i])
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

        for(let i = prices.findIndex((ele) => ele.date.getTime() == dtBegin.getTime()); i < prices.length; i++) {
            cs.push({date: prices[i].date, close: csh})
            let itemAmt = {date: prices[i].date, close: {}}
            let itemV = {date: prices[i].date, close: {}}
            for (let s in amts[i]) {
                let a = amts[i][s]
                itemAmt.close[s] = a
                itemV.close[s] = a * prices[i][s]
            }
            as.push(itemAmt)
            vs.push(itemV)
        }
        let fundInit = new Fund(p, vs, as, cs, dtBegin, prices, [])
        return fundInit
    }

    // trade at day t, if t is after the last of trades which have already taken place
    addTradeStrict(t, tickersLong, percentagesLong, tickersShort, percentagesShort) {
        if ( this.trades.length == 0 || (this.trades.length > 0 && t > this.trades[this.trades.length - 1].date)) {
            let ind = this.cash.findIndex((item) => item.date.getTime() == t.getTime())
            let tradeT = new Trade(this.pool, this.values[ind], this.amounts[ind], this.cash[ind], t, this.prices[ind])
            tradeT.longs(tickersLong, percentagesLong)
            tradeT.short(tickersShort, percentagesShort)

            let ev = tradeT.eval()
            this.values[ind] = ev.values
            this.amounts[ind] = ev.amounts
            this.cash[ind] = ev.cash
            this.trades = this.trades.concat(ev.trades)

            // update data after day t
            for(let i = ind; i < this.cash.length; i++) {
                for (let k in this.values[i].close) { // k is the ticker
                    this.amounts[i].close[k] = this.amounts[ind].close[k]
                    this.values[i].close[k] = this.prices[i].close[k] * this.amounts[ind].close[k]
                }
                this.cash[i].close = this.cash[ind].close
            }
        }
    }

    addLong(t, tickersLong, percentagesLong) { 
            let ind = this.cash.findIndex((item) => item.date.getTime() == t.getTime())
            
            let tradeT = new Trade(this.pool, this.values[ind], this.amounts[ind], this.cash[ind], t, this.prices[ind])

            tradeT.longs(tickersLong, percentagesLong)

            let ev = tradeT.eval()
            this.values[ind] = ev.values
            this.amounts[ind] = ev.amounts
            this.cash[ind] = ev.cash
            this.trades = this.trades.concat(ev.trades)
            // update data after day t
            for(let i = ind + 1; i < this.cash.length; i++) {
                for (let k in this.values[i].close) { // k is the ticker
                    this.amounts[i].close[k] = this.amounts[ind].close[k]
                    this.values[i].close[k] = this.prices[i].close[k] * this.amounts[ind].close[k]   
                }
                this.cash[i].close = this.cash[ind].close
            }
    }

    addShort(t, tickersShort, percentagesShort) { 
        let ind = this.cash.findIndex((item) => item.date.getTime() == t.getTime())
        let tradeT = new Trade(this.pool, this.values[ind], this.amounts[ind], this.cash[ind], t, this.prices[ind])

        tradeT.shorts(tickersShort, percentagesShort)

        let ev = tradeT.eval()
        this.values[ind] = ev.values
        this.amounts[ind] = ev.amounts
        this.cash[ind] = ev.cash
        this.trades = this.trades.concat(ev.trades)
        // update data after day t
        for(let i = ind + 1; i < this.cash.length; i++) {
            for (let k in this.values[i].close) { // k is the ticker
                this.amounts[i].close[k] = this.amounts[ind].close[k]
                this.values[i].close[k] = this.prices[i].close[k] * this.amounts[ind].close[k]   
            }
            this.cash[i].close = this.cash[ind].close
        }
    }

    val(t) { // evaluate totals of major categories at date t, ex. return {val: 12345, valLong: 10345, valShort: -2000, cash: 4000}
        let total = 0
        let totalLong = 0
        let totalShort = 0

        if(t != null) {
            let ind = this.prices.findIndex((item) => item.date.getTime() == t.getTime())
            let v
            
            for (let k in this.values[ind].close) {
                v = this.values[ind].close[k]
                if (v > 0) {
                    totalLong += +v
                    total += +v
                } else {
                    totalShort += +v
                    total += +v
                }
            }
            total +=  this.cash[ind].close
            
            return {val: total, valLong: totalLong, valShort: totalShort, cash: this.cash[ind].close}
        } 
        
    }

    eval() {
        let res = []
        let d = this.prices[0].date
        let r
        for (let i=0;i<this.prices.length;i++) {
            d = this.prices[i].date
            r = this.val(d)
            res.push({date: d, val: r['val'], valLong: r['valLong'], valShort: r['valShort'], cash: this.cash[i].close})
        }
        return res
    }

    total(t) { // evaluate total at date t, ex. return 12345
        let total = 0
        let ind = this.prices.findIndex((item) => item.date.getTime() == t.getTime())
        for (let k in this.values[ind].close) { 
            let v = this.values[ind].close[k]
            total += v
        }
        total +=  this.cash[ind].close
        return total
    }

    // for testing
    printContent(key) {
        
        switch (key) {
            case 'pool':
                console.log(this.pool)
                break
            case 'cash':
                console.log(this.cash)
                break
            case 'prices':
                console.log(this.prices)
                break
            case 'amounts':
                console.log(this.amounts)
                break
            case 'values':
                console.log(this.values)
                break
            case 'trades':
                console.log(this.trades)
                break
            default:
                console.log(this.pool)
                console.log(this.cash)
                console.log(this.values)
                console.log(this.prices)
                console.log(this.amounts)           
                console.log(this.trades)
        }
        
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


// testing functionality of class above, showing how to use as following:
// const aapl2019 = require('./sampleAAPL2019.json')
// const msft2019 = require('./sampleMSFT2019.json')
// const googl2019 = require('./sampleGOOGL2019.json')
// // save only date and close price into new object
// let pool = ['aapl', 'msft', 'googl']
// let values = []
// let amounts = []
// let ps = []
// let cs = []
// let c0 = 100000
// const amts0 = {'aapl': 200, 'msft': 200, 'googl': 200}
// let currentDate
// for (let i=0;i<aapl2019.length;i++) {
//     currentDate = new Date(aapl2019[i].date)
//     ps.push({date: currentDate, close: {'aapl': aapl2019[i].close, 'msft': msft2019[i].close, 'googl': googl2019[i].close}})
//     amounts.push({date: currentDate, close: clone(amts0)}) // need deep copy or all elements change if one change
//     cs.push({date: currentDate, close: clone(c0)}) // need deep copy or all elements change if one change
//     values.push({date: currentDate, close: {'aapl': aapl2019[i].close * clone(amts0)['aapl'], 'msft': msft2019[i].close * clone(amts0)['aapl'], 'googl': googl2019[i].close * clone(amts0)['aapl']}})
// }

// sort the arrays by date
// ps.sort((a, b) => a.date - b.date)
// cs.sort((a, b) => a.date - b.date)
// values.sort((a, b) => a.date - b.date)
// amounts.sort((a, b) => a.date - b.date)


// let t0 = cs[0].date
// let t1 = cs[3].date
// let t2 = cs[10].date

// let testFund = new Fund(pool, values, amounts, cs, t0, ps, [])


// let trade0 = new Trade(pool, testFund.values[0], testFund.amounts[0], testFund.cash[0], t0, testFund.prices[0])
// testFund.addTrade(t1, ['aapl'], [0.2], 'msft', [0.1])
// testFund.addTrade(t1, ['googl'],[0.2], [], [])
// console.log(testFund.printContent('amounts'))

// console.log('before longing')
// console.log(cs[10])
// testFund.addLong(t1, ['msft','aapl'], [0.1,0.2])
// testFund.addShort(t2, ['msft','googl'], [0.3,0.5])
// // testFund.addTradeStrict(t1,['aapl','googl'], [0.1,0.2], ['msft'], [0.3])
// // testFund.addTradeStrict(t2,['aapl','googl'], [0.3,0.4], ['googl'], [0.5])
// console.log(testFund.printContent('trades'))

export default Fund