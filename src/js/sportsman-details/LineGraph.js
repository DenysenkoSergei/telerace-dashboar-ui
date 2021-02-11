import React from 'react';
import Chart from "chart.js";
import * as zoom from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import 'chartjs-plugin-annotation';

class LineGraph extends React.Component {
    chartRef = React.createRef();
    chart = null;
    maxValuesIndexes = [];

    constructor(props) {
        super(props);

        this.buildChart = this.buildChart.bind(this);
    }

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        if (this.chart) {
            const {data, showPowerNorm } = this.props.chartData;
            const prevData = this.chart.data.datasets[0].data;
            let currentCharSize = prevData.length;
            let sizeDiff = data.length - currentCharSize;
            let calculatedMaxValue = +this.chart.options.annotation.annotations[0].value;
            if (sizeDiff > 0) {
                const currentData = [];
                const avgData = [];
                const powerNorm = [];
                const preparedLabels = []
                for (let i = currentCharSize; i < data.length; ++i) {
                    let currentElement = +data[i].split("/")[0];
                    calculatedMaxValue = calculatedMaxValue > currentElement ? calculatedMaxValue : currentElement;
                    currentData.push(currentElement);
                    avgData.push(parseFloat(data[i].split("/")[2]).toFixed(2));
                    if (showPowerNorm) {
                        powerNorm.push(parseFloat(data[i].split("/")[3]).toFixed(2));
                    }
                    preparedLabels.push(new Date(+(data[i].split("/")[1])).toLocaleTimeString());
                }

                if (+this.chart.options.annotation.annotations[0].value < +calculatedMaxValue) {
                    this.maxValuesIndexes.forEach(inx => this.chart.data.datasets[0].pointBackgroundColor[inx] = 'transparent');
                }

                for (let j = 0; j < sizeDiff; ++j) {
                    if (currentData[j] == calculatedMaxValue) {
                        this.maxValuesIndexes.push(currentCharSize + j);
                        this.chart.data.datasets[0].pointBackgroundColor.push('#CF1948');
                    } else {
                        this.chart.data.datasets[0].pointBackgroundColor.push('transparent');
                    }
                    this.chart.data.labels.push(preparedLabels[j]);
                    this.chart.data.datasets[0].data.push(currentData[j]);
                    this.chart.data.datasets[1].data.push(avgData[j]);
                    if (showPowerNorm) {
                        this.chart.data.datasets[2].data.push(powerNorm[j]);
                    }
                }
                this.chart.options.annotation.annotations[0].value = calculatedMaxValue;
                this.chart.update();
            }

        }
    }

    buildChart() {
        const myChartRef = this.chartRef.current.getContext("2d");

        this.maxValuesIndexes = [];

        const {data, maxValue, showPowerNorm, gradientFrom, gradientTo} = this.props.chartData;

        const currentData = data.map(dataObject => dataObject.split("/")[0]);
        const avgData = data.map(dataObject => parseFloat(dataObject.split("/")[2]).toFixed(2));
        let powerNorm = [];
        if (showPowerNorm) {
            powerNorm = data.map(dataObject => parseFloat(dataObject.split("/")[3]).toFixed(2));
        }
        const preparedLabels = data.map(dataObject => new Date(+dataObject.split("/")[1]).toLocaleTimeString());

        const pointColors = currentData.map((data, index) => {
            if (data == maxValue) {
                this.maxValuesIndexes.push(index);
                return '#CF1948';
            } else {
                return 'transparent';
            }
        });

        let originalLineDraw = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
            draw: function() {
                originalLineDraw.apply(this, arguments);

                if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                    let activePoint = this.chart.tooltip._active[0];
                    let ctx = this.chart.ctx;
                    let x = activePoint.tooltipPosition().x;
                    let topY = this.chart.scales['y-axis-0'].top;
                    let bottomY = this.chart.scales['y-axis-0'].bottom;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 0.25;
                    ctx.strokeStyle = '#000000';
                    ctx.setLineDash([3]);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });

        let gradient = myChartRef.createLinearGradient(0, 0, 760, 200);
        gradient.addColorStop(0, gradientFrom);
        gradient.addColorStop(1, gradientTo);

        Chart.defaults.global.defaultFontFamily = "Ubuntu, sans-serif";
        Chart.defaults.global.fontSize = "12";

        let preparedDatasets = [
            {
                id: "live",
                borderColor: "transparent",
                backgroundColor: gradient,
                pointBackgroundColor: pointColors,
                pointBorderColor: "transparent",
                data: currentData,
                hoverRadius: 8,
                radius: 8,
                order: 1
            },
            {
                id: "avg",
                borderColor: "#000000",
                borderDash: [10,10],
                backgroundColor: "transparent",
                pointBackgroundColor: "transparent",
                pointBorderColor: "transparent",
                borderWidth: 2,
                data: avgData,
                order: 2
            }
        ]

        if (showPowerNorm) {
            preparedDatasets.push(
                {
                    id: "powerNorm",
                    borderColor: "#1395D7",
                    borderDash: [10,10],
                    backgroundColor: "transparent",
                    pointBackgroundColor: "transparent",
                    pointBorderColor: "transparent",
                    data: powerNorm,
                    borderWidth: 2,
                    order: 3
                }
            )
        }

        this.chart = new Chart(myChartRef, {
            type: "line",
            data: {
                labels: preparedLabels,
                datasets: preparedDatasets
            },
            options: {
                animation: {
                    duration: 0
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: false
                        },
                        ticks: {
                            beginAtZero: true,
                            autoSkip: true,
                            autoSkipPadding: 200,
                            maxRotation: 0,
                            minRotation: 0
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 3
                        },
                        gridLines: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: false
                        }
                    }]
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    displayColors: false,
                    callbacks: {
                        label: function (tooltipItems, data) {
                            if (tooltipItems.datasetIndex == 0) {
                                return  "live: " + tooltipItems.yLabel;
                            } else if (tooltipItems.datasetIndex == 1) {
                                return  "avg: " + tooltipItems.yLabel;
                            } else {
                                return  "norm: " + tooltipItems.yLabel;
                            }
                        }
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                annotation: {
                    annotations: [
                        {
                            drawTime: 'beforeDatasetsDraw',
                            id: 'a-line-1',
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y-axis-0',
                            value: maxValue,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderDash: [2, 2],
                        }
                    ]

                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x'
                        },

                        zoom: {
                            enabled: true,
                            mode: 'x',
                        }
                    }
                }
            }
        });

        /*setInterval(function(){
            // Add two random numbers for each dataset
            chart.addData([Math.random() * 100, Math.random() * 100], new Date().getTime());
            // Remove the first point so we dont just add values forever
        }, 100);*/
    }

    render() {
        return <div className="d-flex align-items-center h-100 w-100">
            <canvas style={{width: "100%", height: "90%"}}
                    id={this.props.id}
                    ref={this.chartRef}
            />
        </div>
    }

}

export default LineGraph;