import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageTitleService, AgentService, MetricService } from '../_services';
import { Metric } from '../_models';

import {
    getMetricNameByType
} from '../_helpers';

declare let Highcharts: any;

@Component({templateUrl: 'metric.component.html', styleUrls: ['metric.component.less']})
export class MetricComponent implements OnInit {

    private agentID: string;
    private metricID: string;
    private metric: Metric;
    private currentState: any;
    private currentStateTimestamp: any;
    private chart: any;
    private history: any;
    private initDone = false;
    private chartData: any = {};
    private fields = [];
    private _selectedDataset = '';

    private MAX_CHART_POINTS = 1000;

    Object = Object;
    getMetricNameByType = getMetricNameByType;
    
    constructor(
        private pageTitle: PageTitleService, 
        private route: ActivatedRoute, 
        private agentService: AgentService,
        private metricService: MetricService
    ){}

    ngOnInit() {
        this.pageTitle.setPageTitle('Metric');
        this.route.params.subscribe(params => {
            this.agentID = params.agentID;
            this.metricID = params.metricID;

            this.metricService.getMetric(
                parseInt(this.metricID), 
                this.getYesterday().getTime(), 
                new Date().getTime(), 
                this.MAX_CHART_POINTS
            ).subscribe(data => {
                this.metric = data.metric;
                this.currentState = Object.assign({}, data.history[data.history.length-1]);
                this.currentStateTimestamp = this.formatDate(new Date(this.currentState['timestamp']));
                delete this.currentState['id'];
                delete this.currentState['timestamp'];
                delete this.currentState['type'];
                this.history = data.history;
                this.createChartData();
                if (this.initDone && !this.chart) {
                    setTimeout(this.createChart.bind(this), 100);
                }
            }, console.error);
        });
    }

    ngAfterViewInit() {
        if (this.history !== undefined) {
            if (!this.chart) {
                this.createChart();
            }
        }
        this.initDone = true;
    }

    get selectedDataset(): string {
        return this._selectedDataset;
    }

    set selectedDataset(n: string) {
        if (this.chart) {
            this.chart.update({
                title: {
                    text: getMetricNameByType(this.metric.type) + ': ' + n,
                },
                series: [{
                    type: 'area',
                    name: n,
                    data: this.chartData[n]
                }]
            });
        }
        this._selectedDataset = n;
    }

    getYesterday(): Date {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    }

    formatDate(d: Date): String {
        return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + " " + ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            d.getFullYear();
    }

    createChartData() {
        if (this.metric.type === 'memory') {
            this.createMemoryChartData();
        }

        this.selectedDataset = this.fields[0];
    }

    createMemoryChartData() {
        this.fields = Object.keys(this.history[0]).filter(n => n !== 'id' && n !== 'type' && n !== 'timestamp');
        for (let record of this.history) {
            let time = new Date(record.timestamp).getTime();
            for (let field of this.fields) {
                this.chartData[field] = (this.chartData[field] || []);
                this.chartData[field].push([
                    time,
                    record[field],
                ]);
            }
        }
    }

    createChart() {
        this.chart = Highcharts.chart('metricChart', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: getMetricNameByType(this.metric.type) + ': ' + this.selectedDataset,
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: this.selectedDataset,
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: this.selectedDataset,
                data: this.chartData[this.selectedDataset]
            }]
        });
    }

}