// very similar with stock chart, this is for chart the portfolio return curve
// below return curve, there could be asset allocation chart (accumulative bar chart)


import React from "react"


// import { TimeRange, time, TimeSeries, atTime } from "pondjs"

import { Charts, ChartContainer, ChartRow, YAxis, LineChart, BarChart, Resizable, Baseline, EventMarker} from "react-timeseries-charts"

// the chart component showing value series of a portfolio
// props needed are TimeSeries objects: series 
class PortfolioChart extends React.Component {
    constructor(props) {
        super(props) // should have props.series of class TimeSeries, containing value data, column "close" is used
        this.state = {
            mode: "linear", // could be "log", but not suitable in this case
            timerange: this.props.series.range(), // TimeSeries object's range() method return a TimeRange object
            tracker: null, // eventTime used for labeling current point
            trackerEvent: null, // event used for labeling current point
            trackerValue: null, // event value used for labeling current point
            x: null, // mouse position
            y: null, // mouse position
            mid: null // the average of max and min of the price range
        }
    }

    // handler for tracking CrossHairs position
    handleMouseMove = (a, b) => {
        this.setState({x: a})
        this.setState({y: b})
    }

    // handler for showing label of a point
    handleTrackerChanged = (t) => {
        if (t) {           
            const e = this.props.series.atTime(t);
            const eventTime = new Date(
                e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2
            )
            const eventValue = e.get("close")
            this.setState({ tracker: eventTime, trackerValue: eventValue, trackerEvent: e });
        } else {
            this.setState({ tracker: null, trackerValue: null, trackerEvent: null, x: null, y: null });
        }
    }

    // Marker shows label of point
    renderMarker = () => {
        return (
            <EventMarker
                type="point"
                axis="y"
                event={this.state.trackerEvent}
                column= "close"
                markerLabel={this.state.trackerValue}
                markerLabelStyle={{ fill: "#000000", stroke: "white" }}
                markerRadius={3}
                markerStyle={{ fill: "#00ff00" }}
            />
        )
    }
    
    // event handler of changing time range of the time series
    handleTimeRangeChange = timerange => {
        this.setState({ timerange })
    }

    // function returning main JSX element, line-chart for value (and bar-chart for asset allocation)
    renderChart = () => {
        const { timerange } = this.state
        const croppedSeries = this.props.series.crop(timerange)
        
        // baselines are the horizontal lines showing percentile levels
        const baselineStyle = {
            line: {
                stroke: "gray",
                strokeWidth: 1
            }
        }

        // percentile levels to be used for baselines
        const mid = (this.props.series.min("close") + this.props.series.max("close"))/2
        const upfifty = (mid + this.props.series.max("close"))/2
        const lowfifty = (mid + this.props.series.min("close"))/2
        
        return (
            <ChartContainer
                timeRange={timerange}
                hideWeekends={true}
                enablePanZoom={true}
                onTimeRangeChanged={this.handleTimeRangeChange}
                onTrackerChanged={this.handleTrackerChanged}
                onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                timeAxisStyle={{ axis: { fill: "none", stroke: "none" } }}
            >
                <ChartRow height="300">
                    <Charts>                       
                        <LineChart
                            axis="y"
                            style={{ close: { normal: { stroke: "#000000" } } }}
                            columns={["close"]}
                            series={croppedSeries}
                        />
                        <Baseline
                            axis="y"
                            value={mid}
                            label="Middle"
                            style={baselineStyle}
                            position="right"
                        />
                        <Baseline
                            axis="y"
                            value={upfifty}
                            label="Upper 50 persentile"
                            style={baselineStyle}
                            position="right"
                        />
                        <Baseline
                            axis="y"
                            value={lowfifty}
                            label="Lower 50 persentile"
                            style={baselineStyle}
                            position="right"
                        />
                        {this.renderMarker()}
                        <CrossHairs x={this.state.x} y={this.state.y} />
                    </Charts>
                    <YAxis
                        id="y"
                        label="Value ($)"
                        min={croppedSeries.min("close")}
                        max={croppedSeries.max("close")}
                        format=",.0f"
                        width="40"
                        type={this.state.mode}
                    />
                </ChartRow>
                
            </ChartContainer>
        )
    }

    render(props) {
        return (
                    <div className="col-md-12">
                        <Resizable>{this.renderChart(props)}</Resizable>
                    </div>
        )
    }
}

// CrossHairs is to tracking mouse movement with cross shown to make reading position easier
// this Component use HTML SVG element <g> and <line>
class CrossHairs extends React.Component {
    render() {
        let x = this.props.x
        let y = this.props.y
        const style = { pointerEvents: "none", stroke: "#aaaaaa" }
        if (x != null && y != null) {
            return (
                <g>
                    <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                    <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
                </g>
            )
        } else {
            return <g />
        }
    }
}

// Export example
export default PortfolioChart