import React from 'react'
import {Container, Row, Col, Button} from "react-bootstrap"
import BuildPortfolio from './BuildPortfolio'

export default function Portfolio() {
    return (

<Container>
    <Row className="justify-content-center">
    <Button variant="outline-warning" size="lg" className="p-1"> + </Button>
    </Row>
    <Row>
         show some examples.
    </Row>
    <Row>
        
        <BuildPortfolio />
    </Row>
    
</Container>
    )
}
