import React from 'react'

import {Form, Col, Button, InputGroup, Container, Row} from 'react-bootstrap'

import { getP, replaceP } from './PortfolioConnections'




const clone = require('rfdc')()

const testTrades = [
        {
            date: new Date("2019-01-31"),
            direction: 'long',
            target: 'aapl',
            percentage: 0.2

        }
        // {
        //     date: new Date("2019-02-31"),
        //     direction: 'long',
        //     target: 'msft',
        //     percentage: 0.2
        // },
        // {
        //     date: new Date("2019-02-31"),
        //     direction: 'long',
        //     target: 'googl',
        //     percentage: 0.2
        // }
    ]

class BuildPortfolio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            validated: false,
            lines: testTrades, // the trades data
            name: 'myPortfolio',
            begin: '2018-12-31', // should work with Date.parse()
            cash: 100000,
            benchmark: 0
        }
    }

    checkInitValid() {
        let validDate = !isNaN(Date.parse(this.state.begin))
        let validName = (this.state.name != '')
        let validCash = (this.state.cash > 0)
        let validBenchmark = (this.state.benchmark >= 0)
        if (validDate && validName && validCash && validBenchmark) {
            this.validated = true
            return true
        }
    }

    checkTradeValid(date, direction, target, percentage) {
        let validDate = !isNaN(Date.parse(date)) && (Date.parse(date) >= Date.parse(this.state.begin))
        let validDirection = (direction == 'long' || direction == 'short')
        let validTarget = true // to be worked on checking if it is a valid symbol 
        let validPercentage = (percentage >= 0 && percentage <= 1)
        return validDate && validDirection && validTarget && validPercentage
    }

    handleSubmit = (event) => {
        // const form = event.currentTarget
        // if (form.checkValidity() === false) {
        // event.preventDefault()
        // event.stopPropagation()
        // }
        // access to form data

        event.preventDefault()
        if (this.checkInitValid) {
            let newP = {
                // first_name: p.first_name,
                // last_name: p.last_name,
                // email: p.email,
                first_name: 'a',
                last_name: 'b',
                email: 'ab@email.com',
                name: this.state.name,
                begin: this.state.begin,
                cash: this.state.cash,
                benchmark: this.state.benchmark,
                trades: []
            }
            console.log(this.state.lines)
            // only push valid trade inputs
            for (let i = 0; i < this.state.lines.length; i++) {
                let trade = this.state.lines[i]
                console.log('trade..')
                console.log(this.state.lines[i])
                if(this.checkTradeValid(trade.date, trade.direction, trade.target, trade.percentage)) {
                    console.log("entered 1st layer")
                    if (newP.trades.length > 0) { // dates of trades should be non-descending
                        if (Date.parse(trade.date) >= Date.parse(newP.trades[newP.trades.length - 1].date)) {
                            console.log("entered last")
                            newP.trades.push(this.state.lines[i])
                        }
                    } else {
                        newP.trades.push(this.state.lines[i])
                    }
                }
            }
    
            replaceP(newP).then(res => {
                // this.props.history.push(`/login`)
                console.log('replaceP executed')
            })
        }
        

        
    }

    addRow = () => {
        // ReactDOM.render(<this.Record />,
        //     document.getElementById('existing')) // not works
        
        let newArray = clone(this.state.lines)
        newArray.push(this.state.lines[0])
        this.setState({...this.state, lines: newArray})

        console.log(this.state.lines)

    }


    // new row of trade to be append
    Trade(i) {
            // console.log(i.num)
            // console.log(i.da)
            return (
            <Form noValidate id={"form" + i.num}>          
                <Form.Row className="justify-content-center text-center">
                    <Form.Group as={Col} md="3" controlId="validationCustom01">
                    <Form.Label>Trade Date</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="YYYY-MM-DD"
                        defaultValue="2019-03-31"
                        size="lg"
                        onChange={
                            (e) => {
                                    let items = [...i.da.state.lines] // shallow copy of array
                                    let item = {...items[i.num]} // shallow copy of item
                                    item.date = e.target.value // date string
                                    items[i.num] = item // mutating
                                    i.da.setState((states, props) => ({lines: items})) // faster update with setState((states, props) => ({}))
                                    console.log('update date?' + e.target.value)
                                    }
                            }
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid date.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom02" className="justify-content-center">
                    <Form.Label>Long/Short</Form.Label>
                    <Form.Check type="switch" id={"switch" + i.num} label="Short" size="lg" onChange={
                            (e) => {
                                    let items = [...i.da.state.lines] // shallow copy of array
                                    let item = {...items[i.num]} // shallow copy of item
                                    item.direction = (e.target.value == "on") ? "short" : "long" // date string
                                    items[i.num] = item // mutating
                                    i.da.setState((states, props) => ({lines: items})) // faster update with setState((states, props) => ({}))
                                    console.log('update direction?' + e.target.value)
                                    }
                            } 
                    />
                    <Form.Control.Feedback type="invalid">
                        Long by default.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom03">
                    <Form.Label>Target</Form.Label>
                    <Form.Control as="select" size="lg" custom onChange={
                            (e) => {
                                    // i.da.setState({temp: e.target.value}) // async way, not guarranteed to be instant execution
                                    let items = [...i.da.state.lines] // shallow copy of array
                                    let item = {...items[i.num]} // shallow copy of item
                                    item.target = e.target.value // targeted stock symbol
                                    items[i.num] = item // mutating
                                    i.da.setState((states, props) => ({lines: items})) // faster update with setState((states, props) => ({}))
                                    console.log('update target?' + e.target.value)
                                    }
                            } 
                        >
                        <option>aapl</option>
                        <option>msft</option>
                        <option>googl</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Choose one in watchlist.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>Percentage</Form.Label>
                    <Form.Control type="range" custom onChange={
                            (e) => {
                                    let items = [...i.da.state.lines] // shallow copy of array
                                    let item = {...items[i.num]} // shallow copy of item
                                    item.percentage = Number(e.target.value)/100 // percentage number
                                    items[i.num] = item // mutating
                                    i.da.setState((states, props) => ({lines: items})) // faster update with setState((states, props) => ({}))
                                    console.log('update percentage?' + e.target.value)
                                    }
                            }
                            />
                    <Form.Control.Feedback type="invalid">
                        Percentage from 0 to 100.
                    </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                
            
        </Form>
        )

    }




    render() {
        return (
        <Container className="justify-content-center bg-light p-3 border border-warning rounded-lg">
        <Row className="justify-content-center p-1">
            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} >
                <Form.Row className="justify-content-center p-1">
                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Initial Date</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="YYYY-MM-DD"
                        defaultValue="2018-12-31"
                        size="lg"
                        onChange={(e) => { this.setState({begin: e.target.value})}}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Initial Cash</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Cash"
                        defaultValue="100000"
                        size="lg"
                        onChange={(e) => {this.setState({cash: Number(e.target.value)})}}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustomName">
                    <Form.Label>Portfolio Name</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Portfolio Name"
                        size="lg"
                        required
                        onChange={(e) => {this.setState({name: e.target.value})}}
                        />
                        <Form.Control.Feedback type="invalid">
                        Descriptional of stradegy
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom03">
                    <Form.Label>Benchmark</Form.Label>
                    <InputGroup>
                        <Form.Control
                        type="text"
                        placeholder="0"
                        size="lg"
                        aria-describedby="inputGroupPrepend"
                        required
                        onChange={(e) => {this.setState({benchmark: Number(e.target.value)/100})}}
                        />
                        <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control.Feedback type="invalid">
                        Annual return of benchmark
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                
                <Form.Row className="justify-content-center">
                    <Button type="submit" variant="outline-warning" size="lg" className="p-2" >Save</Button>
                </Form.Row>
                
            </Form>
        </Row>
        
        <Row className="justify-content-center p-1">
            <Button type="submit" size="lg" onClick={this.addRow}>Add a Trade</Button>
        </Row>

        <Row className="justify-content-center p-1">
            {
                this.state.lines.map( (e) => (<this.Trade num={this.state.lines.findIndex((ele) => ele == e)} da={this}/>))
            }
        </Row>
        </ Container>
        )
    }


}

export default BuildPortfolio