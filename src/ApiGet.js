import moment from "moment"
import { Collection, TimeSeries, TimeEvent, TimeRange, IndexedEvent } from "pondjs"
import statsStock from './statsStock'




// fetch data from tiingo api
function ApiGet(symbol, dateStr1, dateStr2) {
// function ApiGet(tempMeta, stockSeries) {
    const fetch = require("node-fetch")
    // const tiingoString = "https://api.tiingo.com/tiingo/daily/" + symbol + "/prices?startDate=" + dateStr1 + "&endDate=" + dateStr2 + "&format=json&&token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    // const tiingoMeta = "https://api.tiingo.com/tiingo/daily/" + symbol + "?token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    
    // save returned data as an object, example as in sampleJSON file
    let temp = null
    let tempMeta = null
    // building timeseries

    // sample in tiingo format for test
    const stockSeries = require("./sampleJSON.json") 
    // const stockSeries = temp // fetch from tiingo api
    

    // to series as a TimeSeries of (close)price info
    const name = tempMeta.ticker
    const columns = ["time", "close"]
    const events = stockSeries.map(item => {
        const timestamp = moment(new Date(item.date))
        const { close } = item
        return new TimeEvent(timestamp.toDate(), {
            close: +close
        })
    })
    const collection = new Collection(events)
    const sortedCollection = collection.sortByTime()
    const series = new TimeSeries({ name, columns, collection: sortedCollection })
    const stats = statsStock(series)
    // to seriesVolumn as a TimeSeries of volumn info
    const volumeEvents = stockSeries.map(item => {
        const index = item.date.replace(/\//g, "-")
        const { volume } = item
        return new IndexedEvent(index, { volume: +volume })
    })
    const volumeCollection = new Collection(volumeEvents);
    const sortedVolumeCollection = volumeCollection.sortByTime()
    const seriesVolume = new TimeSeries({
        name: "Volume",
        utc: false,
        collection: sortedVolumeCollection
    })

    // meta data

    // comment this line and uncomment api call to fetch from api server
    tempMeta = require('./sampleMeta.json') 
    const description = tempMeta.description
    const companyName = tempMeta.name
    const ticker = tempMeta.ticker

    return {'series': series, 'seriesVolume': seriesVolume, 'companyName': companyName, 'ticker': ticker, 'description': description, 'stats': stats}
    // to call the chart component, use the following code in other components
    // const ele = <PriceVol series={series} seriesVolume={seriesVolume} />
}

export default ApiGet


