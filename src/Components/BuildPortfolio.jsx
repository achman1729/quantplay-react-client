import React from 'react'

import {Form, Col, Button, InputGroup, Container, Row} from 'react-bootstrap'

const clone = require('rfdc')()

const testTrades = [
        {
            date: new Date("20190131"),
            direction: 'long',
            target: 'aapl',
            percentage: 0.2

        },
        {
            date: new Date("20190231"),
            direction: 'long',
            target: 'msft',
            percentage: 0.2
        },
        {
            date: new Date("20190231"),
            direction: 'long',
            target: 'googl',
            percentage: 0.2
        }
    ]

class BuildPortfolio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            validated: false,
            setValidated: false,
            lines: testTrades,
            switch: 'long',
            temp: null
        }
    }

    handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        }
        // access to form data

        
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
            console.log(i.num)
            console.log(i.da)
            return (
            <Form noValidate id={"form" + i.num}>          
                <Form.Row>
                    <Form.Group as={Col} md="3" controlId="validationCustom01">
                    <Form.Label>Trade Date</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="YYYYMMDD"
                        defaultValue="20181231"
                        size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid date.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom02">
                    <Form.Label>Long/Short</Form.Label>
                    <Form.Check type="switch" id={"switch" + i.num} label="Short" size="lg" onChange={(e) => {console.log(e.target.parentElement)}} />
                    <Form.Control.Feedback type="invalid">
                        Long by default.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom03">
                    <Form.Label>Target</Form.Label>
                    <Form.Control as="select" size="lg" custom onChange={
                            (e) => {
                                    i.da.setState({temp: e.target.value})
                                    let items = [...i.da.state.lines] // shallow copy of array
                                    let item = {...items[i.num]} // shallow copy of item
                                    item.target = e.target.value
                                    items[i.num] = item // mutating
                                    i.da.setState((states, props) => ({lines: items}))
                                    console.log('muted?')
                                    
                                    
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
                    <Form.Control type="range" custom onChange={(e) => console.log(e.target.value)}/>
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
                        placeholder="YYYYMMDD"
                        defaultValue="20181231"
                        size="lg"
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
                    <Button type="submit" variant="outline-warning" size="lg" className="p-1" >Save</Button>
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