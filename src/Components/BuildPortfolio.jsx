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

    // [validated, setValidated] = useState(false)

    handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        }
        // access to form data

        
    }

    handleNewTrade = (event) => {
        // const f = event.currentTarget
        // if (f.checkValidity() === false) {
        // event.preventDefault()
        // event.stopPropagation()
        // }
        
        this.Trade()
        
        
    }

    // test about onChange eventHandler
    changeSth(e) {
        console.log(this.state.lines)

    }

    // new row of trade to be append
    Trade(i) {
            console.log(i.num)
            console.log(i.da)
            return (
            <Form noValidate id={"form" + i.num}>          
                <Form.Row>
                    <Form.Group as={Col} md="3" controlId="validationCustom03">
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
                    <Form.Group as={Col} md="3" controlId="validationCustom03">
                    <Form.Label>Long/Short</Form.Label>
                    <Form.Check type="switch" id={"switch" + i.num} label="Short" size="lg" onChange={(e) => {console.log(e.target.parentElement)}} />
                    <Form.Control.Feedback type="invalid">
                        Long by default.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom04">
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
                    <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Percentage</Form.Label>
                    <Form.Control type="range" custom onChange={(e) => console.log(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid zip.
                    </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                
            
        </Form>
        )
        this.state.addNew = false
    }


    addRow = () => {
        // ReactDOM.render(<this.Record />,
        //     document.getElementById('existing')) // not works
        
        let newArray = clone(this.state.lines)
        newArray.push(this.state.lines[0])
        this.setState({...this.state, lines: newArray})

        console.log(this.state.lines)

    }

    render() {
        return (
        <Container>
        <Row id="exisiting"></Row>
        <Row>
            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
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
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
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
                    <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                    <Form.Label>Portfolio Name</Form.Label>
                    <InputGroup>
                        {/* <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                        </InputGroup.Prepend> */}
                        <Form.Control
                        type="text"
                        placeholder="Portfolio Name"
                        size="lg"
                        aria-describedby="inputGroupPrepend"
                        required
                        />
                        <Form.Control.Feedback type="invalid">
                        Descriptional of stradegy
                        </Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                </Form.Row>
                
                <Form.Row >
                    <Button type="submit" variant="outline-warning" size="sm" className="p-1" >Update</Button>
                </Form.Row>
                
            </Form>
        </Row>
        
        <Row>
            <Button type="submit" size="lg" className="p-1" onClick={this.addRow}>Add</Button>
        </Row>

        <Row>
            {
                this.state.lines.map( (e) => (<this.Trade num={this.state.lines.findIndex((ele) => ele == e)} da={this}/>))
            }
        </Row>
        </ Container>
        )
    }


}

export default BuildPortfolio