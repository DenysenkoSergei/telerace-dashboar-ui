import React from 'react';
import * as d3 from 'd3';

class LineChart extends React.Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        let parent = document.querySelector("#" + this.props.id);

        const width = parent.clientWidth;
        const height = parent.clientHeight;
        const data = this.props.data;

        const margin = ({top: 20, right: 20, bottom: 30, left: 30});

        const x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.timestamp))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        const area = d3.area()
            .curve(d3.curveLinear)
            .x(d => x(d.timestamp))
            .y0(y(0))
            .y1(d => y(d.value))

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        const svg =
            d3.select('#' + this.props.id)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("path")
            .datum(data)
            .attr("fill", "steelblue")
            .attr("d", area);
    }

    render() {
        return <div className="h-100 w-100" id={this.props.id}>

        </div>
    }

}

export default LineChart;