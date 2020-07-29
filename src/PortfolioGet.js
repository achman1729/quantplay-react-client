import moment from "moment"
import { Collection, TimeSeries, TimeEvent, TimeRange, IndexedEvent } from "pondjs"
import Fund from './tradeValue'

// get portfolio data, return series, {name, trades, description, creator}
function PortfolioData(portfolioName) {
    // using samples to test in the same format, pool within watchlist, dateBegin/(initial)cash/benchmark from user input
    const pool = ['aapl', 'msft', 'googl']
    const dateBegin = new Date("2018-12-31")
    const cash = 100000
    const benchmark = 0 // annual return of benchmark

    const trades = [{   // ex. buy apple stock from 50% of cash at 2019-01-25
                        date: new Date("2019-01-25"),
                        direction: "long",
                        target: "aapl",
                        percentage: 0.5
                    },
                    {   // ex. buy msft stock from 50% of cash at 2019-01-31
                        date: new Date("2019-01-31"),
                        direction: "long",
                        target: "msft",
                        percentage: 0.5
                    },
                    {   // ex. buy googl stock from 100% of cash at 2019-01-31
                        date: new Date("2019-01-25"),
                        direction: "long",
                        target: "googl",
                        percentage: 1
                    }
                ]


    // call api to fetch price info of stocks in pool
    const stockSeries1 = require("./sampleAAPL2019.json")
    const stockSeries2 = require("./sampleMSFT2019.json")
    const stockSeries3 = require("./sampleGOOGL2019.json")

    // to use Fund class constructor to build a portoflio with 0 amounts of stocks in pool
    // constructor(pool, values, amounts, cash, dateBegin, prices, trades)
    // values/amounts/prices are of similar format, ex. [{date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 12345.67, "msft": 22345.67, "googl": 32345.67}}, ...]
    
    // sort price info
    stockSeries1.sort((a, b) => ((new Date(a.date)) - (new Date(b.date))))
    stockSeries2.sort((a, b) => ((new Date(a.date)) - (new Date(b.date))))
    stockSeries3.sort((a, b) => ((new Date(a.date)) - (new Date(b.date))))

    // create prices array
    const prices = stockSeries1.map((item) => {
        let ind = stockSeries1.findIndex((ele) => ele.date == item.date)
        return {date: new Date(item.date),
                close: {
                    [pool[0]]: item.close,
                    [pool[1]]: stockSeries2[ind].close,
                    [pool[2]]: stockSeries3[ind].close
                }
        }
    })

    // create amounts array
    let amounts = stockSeries1.map((item) => {
        // let ind = stockSeries1.findIndex((ele) => ele.date == item.date)
        return {date: new Date(item.date),
                close: {
                    [pool[0]]: 0,
                    [pool[1]]: 0,
                    [pool[2]]: 0
                }
        }
    })

    // create values array
    let values = stockSeries1.map((item) => {
        // let ind = stockSeries1.findIndex((ele) => ele.date == item.date)
        return {date: new Date(item.date),
                close: {
                    [pool[0]]: 0, // prices[ind].close[pool[0]] * amounts[ind].close[pool[0]],
                    [pool[1]]: 0,
                    [pool[2]]: 0
                }
        }
    })

    // create cash array
    let cs = stockSeries1.map((item) => {
        // let ind = stockSeries1.findIndex((ele) => ele.date == item.date)
        return {date: new Date(item.date),
                close: cash
        }
    })
    
    // create a Fund object
    let fund = new Fund(pool, values, amounts, cs, dateBegin, prices, [], benchmark)
    // console.log('testing Fund obj')
    // console.log(fund.eval())

    // go through array of trade
    for (let i = 0; i < trades.length; i++) {
        if(trades[i].direction = "long") {
            fund.addLong(trades[i].date, [trades[i].target], [trades[i].percentage])
        } else {
            fund.addShort(trades[i].date, [trades[i].target], [trades[i].percentage])
        }  
    }

    let ev = fund.eval()
    let stats = fund.stats()
    console.log(stats)

    // create a series of values (type TimeSeries) which would be used by PortfolioChart
    const name = 'myfund1'
    const columns = ["time", "close"]
    const events = ev.map(item => {
        const timestamp = moment(new Date(item.date))
        const close = item.val
        return new TimeEvent(timestamp.toDate(), {
            close: +close
        })
    })
    const collection = new Collection(events)
    const sortedCollection = collection.sortByTime()
    const series = new TimeSeries({ name, columns, collection: sortedCollection })

    // console.log(series.avg("close"))
    console.log(trades)
    return {'series': series, name: name, trades: trades, description: "whatever", creator: "whoever", stats: stats}

}

export default PortfolioData
