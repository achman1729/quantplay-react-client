import React, {setState} from 'react'
import CardStock from './Card'

import moment from "moment"
import { Collection, TimeSeries, TimeEvent, TimeRange, IndexedEvent } from "pondjs"
import statsStock from '../statsStock'
import Axios from 'axios'

const clone = require('rfdc')()

// working on Card of watchlist
class WatchlistAsync extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            ready: false, 
            readyMeta: false, 
            results: null,
            series: null,
            seriesVolume: null,
            companyName: null,
            ticker: null, 
            description: null, 
            stats: null,
            // these should be past from props by mongo, just for testing
            pool: ['aapl', 'msft', 'googl'],
            begin: '2018-12-31',
            end: '2020-07-30'
        }

    }

    // get portfolio data, return series, {name, trades, description, creator}

    componentDidMount() {
        let s = clone(this.state.pool) // pass ticker in
        let results = [] // result[0], result[1]... each is single fetch from tiingo
        let begin = clone(this.state.begin)
        let end = clone(this.state.end)
        let reqArray = []
        let reqMetaArray = []
        let resultsMeta = []
        let seriesArray = []
        let seriesVolumeArray = []
        let companyNameArray = []
        let descriptionArray = []
        let statsArray = []

        const token = "token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
        const tiingoApi = "/daily/"

        for (let j = 0; j < this.state.pool.length; j++) {
            reqArray.push(Axios.get(`${tiingoApi + s[j]}/prices?startDate=${begin}&endDate=${end}&format=json&&${token}`)
                    .then(response => {
                        console.log('here fetching')
                        console.log(response.data)
                        results.push(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    }))
            
            reqMetaArray.push(Axios.get(`${tiingoApi + s[j]}?${token}`)
                    .then(response => {
                        console.log('here fetching')
                        console.log(response.data)
                        resultsMeta.push(response.data)
                        companyNameArray.push(response.data.name)
                        descriptionArray.push(response.data.description)
                    })
                    .catch(error => {
                        console.log(error)
                    }))
        }
        Promise.all([...reqArray, ...reqMetaArray]).then((v) => {
            console.log(results)
            // below is the manipulation like ApiGet.js to transform tiingo respond to data format used by chart
            // to series as a TimeSeries of (close)price info
            for (let j = 0; j < results.length; j++) { // loop through each stock
                const name = this.state.pool[j]
                const columns = ["time", "close"]
                const events = results[j].map(item => {
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
                const volumeEvents = results[j].map(item => {
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
                seriesArray.push(series)
                seriesVolumeArray.push(seriesVolume)
                statsArray.push(stats)
            } 
            
        })
        .then((v) => {
            this.setState({'series': seriesArray, 'seriesVolume': seriesVolumeArray, 'ticker': this.state.pool, 'stats': statsArray})
            this.setState({ready: true})
        })
        .then((v) => {
            this.setState({companyName: companyNameArray, description: descriptionArray})
        })
        .then((v) => {
            let temp = []
            for (let j = 0; j < this.state.pool.length; j++) {
                temp.push({
                            series: this.state.series[j],
                            seriesVolume: this.state.seriesVolume[j],
                            companyName: this.state.companyName[j],
                            ticker: this.state.ticker[j],
                            description: this.state.description[j],
                            stats: this.state.stats[j]
                        })
            }
            this.setState({results: temp})
            this.setState({readyMeta: true})
        })


    }
    // const { series, seriesVolume, companyName, ticker, description, stats } = ApiGet('aapl', '2019-01-01', '2019-12-31')
    render(props) {
        if(this.state.ready && this.state.readyMeta) {
            
            console.log(this.state.results)
            return (<div>
                        {this.state.results.map(item => (<CardStock series={item.series} seriesVolume={item.seriesVolume} companyName={item.companyName} ticker={item.ticker} description={item.description} stats={item.stats}/>))}
                    </div>)
            
        } else {
            return (<p>loading...</p>)
        }
    }
}
export default WatchlistAsync
