// very similar with stock card in watchlist, this card for visulizing portfolio data

import React, {setState} from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import "../Stylesheets/Card.scss"
// import PortfolioData from '../PortfolioGet'
import PortfolioChart from './PortfolioChart'
import moment from "moment"
import { Collection, TimeSeries, TimeEvent, TimeRange, IndexedEvent } from "pondjs"
import Fund from '../tradeValue'
// import getPriceOfPool from './getPriceOfPool'
import formatDate from '../formatDate'
import Axios from 'axios'

const clone = require('rfdc')()

// const {series, name, trades, description, creator, stats}
// console.log(series.avg("close"))

// working on Card of watchlist
class CardPortfolioAsync extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: false,
            result: null,
            series: null,
            name: null,
            trades: null,
            creator: null,
            stats: null
        }

    }

    // get portfolio data, return series, {name, trades, description, creator}

    componentDidMount() {
        const pool = ['aapl', 'msft', 'googl']
        const dateBegin = new Date("2018-12-31")
        const begin = formatDate(dateBegin)
        console.log(begin)
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
        // const stockSeries1 = require("./sampleAAPL2019.json")
        // const stockSeries2 = require("./sampleMSFT2019.json")
        // const stockSeries3 = require("./sampleGOOGL2019.json")
        // console.log(getPriceOfPool(pool, '2019-12-31'))

        let stocksSeries = []
        // calling real api through getPriceOfPool
        let results = [] // default start date could be changed

        const token = "token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
        const tiingoApi = "/daily/"

        const date = formatDate(new Date())
        let reqArray = []
        // function fetching stock prices from begin to today
        for (let i = 0; i < pool.length; i++) {
            let s = pool[i]
            // console.log('here ' + pool + ' here ' )
            // console.log(begin)
            // console.log(`${tiingoApi + s}/prices?startDate=${begin}&endDate=${date}&format=json&&${token}`)
            reqArray.push(Axios.get(`${tiingoApi + s}/prices?startDate=${begin}&endDate=${date}&format=json&&${token}`)
                .then(response => {
                    console.log('here fetching')
                    console.log(response.data)
                    results.push({symbol: s, data: response.data})
                })
                .catch(error => {
                    console.log(error)
                }))
        }
        // let prices
        let priceA = [] // api version of prices, similar below with surfix 'A'
        let amountA = []
        let valueA = []
        let cashA = []
        let tempClose = {}

        
        Promise.all(reqArray).then((v) => {
            console.log(results)
            for (let i = 0; i < results.length; i++) {
                stocksSeries.push(results[i].data)
                
            }
            console.log(stocksSeries)
        })
        .then((v) => {
                for (let i = 0; i < stocksSeries.length; i++) {
                    stocksSeries[i].sort((a, b) => ((new Date(a.date)) - (new Date(b.date))))
                }
        })
        .then((v) => {
            for (let j = 0; j < stocksSeries[0].length; j++) {
                for (let i = 0; i < stocksSeries.length; i++) {
                    tempClose[pool[i]] = stocksSeries[i][j].close
                }
                console.log(tempClose)
                priceA.push({date: new Date(stocksSeries[0][j].date), close: clone(tempClose)})

            }
            console.log(priceA)

        })
        .then((v) => {
            for (let j = 0; j < stocksSeries[0].length; j++) {
                for (let i = 0; i < stocksSeries.length; i++) {
                    tempClose[pool[i]] = 0
                }
                amountA.push({date: new Date(stocksSeries[0][j].date), close: clone(tempClose)})

            }
            // create values array
            valueA = clone(amountA)
            console.log(valueA)
            // create cash array
            cashA = stocksSeries[0].map((item) => {
                return {date: new Date(item.date),
                        close: cash
                }
            })

            // to use Fund class constructor to build a portoflio with 0 amounts of stocks in pool
            // constructor(pool, values, amounts, cash, dateBegin, prices, trades)
            // values/amounts/prices are of similar format, ex. [{date: new Date("2018-12-31T00:00:00.000Z"), close: {"aapl": 12345.67, "msft": 22345.67, "googl": 32345.67}}, ...]
            // create a Fund object
            let fundA = new Fund(pool, valueA, amountA, cashA, dateBegin, priceA, [], benchmark)
            console.log('testing Fund obj')
            console.log(fundA.eval())
        
            // go through array of trade
            for (let i = 0; i < trades.length; i++) {
                if(trades[i].direction = "long") {
                    fundA.addLong(trades[i].date, [trades[i].target], [trades[i].percentage])
                } else {
                    fundA.addShort(trades[i].date, [trades[i].target], [trades[i].percentage])
                }  
            }
        
            let evA = fundA.eval()
            let statsA = fundA.stats()
            console.log(statsA)
        
            // create a series of values (type TimeSeries) which would be used by PortfolioChart
            const nameA = 'myfund1'
            const columnsA = ["time", "close"]
            const eventsA = evA.map(item => {
                const timestampA = moment(new Date(item.date))
                const closeA = item.val
                return new TimeEvent(timestampA.toDate(), {
                    close: +closeA
                })
            })
            const collectionA = new Collection(eventsA)
            const sortedCollectionA = collectionA.sortByTime()
            const seriesA = new TimeSeries({ nameA, columnsA, collection: sortedCollectionA })
        
            // console.log(series.avg("close"))
            console.log(trades)
            console.log(seriesA.avg("close"))
            // return {'series': seriesA, name: nameA, trades: trades, description: "whatever", creator: "whoever", stats: statsA}
            this.setState({series: seriesA, name: nameA, trades: clone(trades), description: "whatever", creator: "whoever", stats: statsA })
        })
        .then((v) => {
            console.log(this.state)
            this.setState({ready: true})
        })
    }
    
    render(props) {
        if(this.state.ready) {
        return (

            <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
                <Row className="p-2">
                    <Col xs={3} id="symbol" className="h4">{this.state.name}</Col>
                    <Col xs={6} id="valueLatest" className="h3 text-success ">{Math.round((this.state.series.atLast().get("close") + Number.EPSILON) * 100) / 100}</Col>
                    <Col xs={3} id="avatar" >{this.state.creator}</Col>
                </Row>
                <Row>
                    <Col xs={6} >
                        <Row className="justify-content-center h6">
                            <Col id="premium"> {Number.parseFloat(this.state.stats.premium * 100).toPrecision(2)}% </Col><Col id="volatility"> {Number.parseFloat(this.state.stats.volatility * 100).toPrecision(2)}% </Col><Col id="drawback"> {Number.parseFloat(this.state.stats.drawback * 100).toPrecision(2)}% </Col>
                        </Row>
                        <Row className="justify-content-center small">
                            <Col> Premium </Col><Col> Volatility </Col><Col> Max-drawback </Col>
                        </Row>
                    </Col>
                    <Col xs={6} >
                        <Row className="justify-content-center h6">
                            <Col id="rtday"> {Number.parseFloat(this.state.stats.dayReturn * 100).toPrecision(2)}% </Col><Col id="rtmonth"> {Number.parseFloat(this.state.stats.monthReturn * 100).toPrecision(2)}% </Col><Col id="rtyear"> {Number.parseFloat(this.state.stats.fullReturn * 100).toPrecision(2)}% </Col>
                        </Row>
                        <Row className="justify-content-center ">
                            <Col> day </Col><Col> month </Col><Col> all </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3} className="font-italic small text-wrap scroll">
                        <ul>{
                            this.state.trades.map(trade => (<li key={trade.date}>{trade.date + ", "
                                                    + trade.direction + ", "
                                                    + trade.target + ", "
                                                    + trade.percentage * 100 + "%"
                                                }</li>))
                        }
                        </ul>  
                    </Col>
                    <Col id="chart" xs={9}><PortfolioChart series={this.state.series} /></Col>
                </Row>
                <Row className="justify-content-around text-center">
                    <Button variant="outline-warning" size="lg" className="p-1">Edit</Button>
                    <Button variant="outline-warning" size="lg" className="p-1">Post</Button>
                    <Button variant="outline-warning" size="lg" className="p-1">Remove</Button>
                </Row>
            </Container>

    )} else {
        return <p>loading...</p>
    }
    }
}

export default CardPortfolioAsync
