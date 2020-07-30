import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import "../Stylesheets/Card.scss"
import PriceVol from './PriceVol'

export default function CardStock(props) {
    return (

        <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
            <Row className="p-2">
                <Col xs={3} id="symbol" className="h1 ">{props.ticker}</Col>
                <Col xs={6} id="rtprice" className="h2 text-success">{Math.round((props.series.atLast().get("close") + Number.EPSILON) * 100) / 100}</Col>
                <Col xs={2} className="justify-content-end"><Button variant="outline-warning" size="xs" className="p-1">remove</Button></Col>
            </Row>
            <Row>
                <Col xs={3} className="justify-content-center h3">{props.companyName}</Col>
                <Col xs={9}>
                    <Row className="h3">
                        <Col id="rtday"> {Math.round((props.stats.dayReturn + Number.EPSILON) * 10000) / 100}% </Col><Col id="rtmonth"> {Math.round((props.stats.rollingMonthReturn + Number.EPSILON) * 10000) / 100}% </Col><Col id="rtyear"> {Math.round((props.stats.yearReturn + Number.EPSILON) * 10000) / 100}% </Col>
                    </Row>
                    <Row>
                        <Col> day </Col><Col> month </Col><Col> year </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={3} className="font-italic small text-wrap scroll">{props.description}</Col>
                <Col id="chart" xs={9}><PriceVol series={props.series} seriesVolume={props.seriesVolume} /></Col>
            </Row>
        </Container>
    )
}
