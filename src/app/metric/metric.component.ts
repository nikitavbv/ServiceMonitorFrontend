import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageTitleService, AgentService, MetricService, AlertService } from '../_services';
import { Metric, Alert } from '../_models';

import {
    getMetricNameByType
} from '../_helpers';

declare let Highcharts: any;

@Component({ templateUrl: 'metric.component.html', styleUrls: ['metric.component.less'] })
export class MetricComponent implements OnInit {

    private agentID: number;
    private metricID: number;
    private metric: Metric;
    private currentState: any;
    private currentStateTimestamp: any;
    private chart: any;
    private history: any;
    private initDone = false;
    private chartData: any = {};
    private fields = [];
    private _selectedDataset = '';
    private alerts: Alert[];
    private addingAlert: boolean = false;
    private newAlertParameterName: string = '';
    private newAlertCondition: string = '>';
    private newAlertConditionLevel: string = '';
    private newAlertValue: string = '';
    private newAlertAction: string = '';

    private MAX_CHART_POINTS = 1000;

    Object = Object;
    json = JSON;
    getMetricNameByType = getMetricNameByType;

    constructor(
        private pageTitle: PageTitleService,
        private route: ActivatedRoute,
        private agentService: AgentService,
        private metricService: MetricService,
        private alertService: AlertService,
    ) { }

    ngOnInit() {
        this.pageTitle.setPageTitle('Metric');
        this.route.params.subscribe(params => {
            this.agentID = parseInt(params.agentID);
            this.metricID = parseInt(params.metricID);

            this.metricService.getMetric(
                this.metricID,
                this.getYesterday().getTime(),
                new Date().getTime(),
                this.MAX_CHART_POINTS
            ).subscribe(data => {
                this.metric = data.metric;
                this.history = data.history;
                this.alerts = data.alerts.map(alert => Object.assign(new Alert(), alert));

                if (this.history.length > 0) {
                    this.currentState = this.createCurrentState(this.metric.type, data.history[data.history.length - 1]);
                    this.currentStateTimestamp = this.formatDate(new Date(data.history[data.history.length - 1]['timestamp']));
                    delete this.currentState['id'];
                    delete this.currentState['timestamp'];
                    delete this.currentState['type'];
                    this.createChartData();
                    if (this.initDone && !this.chart) {
                        setTimeout(this.createChart.bind(this), 100);
                    }
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

    createAlert() {
        this.addingAlert = false;
        this.alertService.addAlert(
            this.agentID, this.metricID, this.newAlertParameterName, 
            this.newAlertCondition, parseInt(this.newAlertConditionLevel), 
            this.newAlertAction
        ).subscribe(data => {
            this.alerts.push(new Alert(
                data.id, 
                this.newAlertParameterName, 
                this.newAlertCondition, 
                this.newAlertConditionLevel, 
                this.newAlertAction
            ));
        }, console.error);
    }

    deleteAlert(alert: Alert) {
        this.alertService.deleteAlert(alert.id)
            .subscribe(data => {
                this.alerts.splice(this.alerts.indexOf(alert), 1);
            }, console.error);
    }

    getMetricValueDescription(metricType, key, value) {
        if (metricType === 'diskUsage') {
            return value.used + '/' + value.total;
        } else if (metricType === 'memory') {
            return value;
        } else if (metricType === 'docker') {
            return value;
        } else if (metricType === 'io') {
            return value.read + '/' + value.write;
        } else if (metricType === 'cpu') {
            return 'nice: ' + value['nice']
                + ',\nuser: ' + value['user']
                + ',\nsystem: ' + value['system']
                + ',\nidle: ' + value['idle']
                + ',\niowait: ' + value['iowait']
                + ',\nirq: ' + value['irq']
                + ',\nsofirq: ' + value['sofirq']
                + ',\nguest: ' + value['guest']
                + ',\nsteal: ' + value['steal']
                + '\nguestNice: ' + value['guestNice'];
        } else if (metricType === 'network') {
            return value.bytesSent + '/' + value.bytesReceived;
        }
        return JSON.stringify(value);
    }

    createCurrentState(metricType, data) {
        if (metricType === 'diskUsage') {
            let obj = {};
            data.filesystems.forEach(fs => {
                obj[fs.filesystem] = fs;
            });
            return obj;
        } else if (metricType === 'docker') {
            let obj = {};
            data.containers.forEach(container => {
                obj[container.containerName] = container.status;
            });
            return obj;
        } else if (metricType === 'io') {
            let obj = {};
            data.devices.forEach(io => {
                obj[io.device] = io;
            });
            return obj;
        } else if (metricType === 'cpu') {
            let obj = {};
            data.cpus.forEach(cpu => {
                obj[cpu.cpu] = cpu;
            });
            return obj;
        } else if (metricType === 'network') {
            let obj = {};
            data.devices.forEach(device => {
                obj[device.device] = device;
            });
            return obj;
        }
        return Object.assign({}, data);
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
                    data: Object.assign([], this.chartData[n])
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
        return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + " " + ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
            d.getFullYear();
    }

    createChartData() {
        if (this.metric.type === 'memory' || this.metric.type === 'nginx' || this.metric.type === 'mysql') {
            this.createMemoryChartData();
        } else if (this.metric.type === 'diskUsage') {
            this.createDiskUsageChartData();
        } else if (this.metric.type === 'io') {
            this.createIOChartData();
        } else if (this.metric.type === 'cpu') {
            this.createCPUChartData();
        } else if (this.metric.type === 'network') {
            this.createNetworkChartData();
        }

        this.selectedDataset = Object.keys(this.chartData)[0];
    }

    createMemoryChartData() {
        this.fields = Object.keys(this.history[0]).filter(n => n !== 'id' && n !== 'type' && n !== 'timestamp');
        for (let record of this.history) {
            let time = new Date(record.timestamp).getTime();
            for (let field of this.fields) {
                this.chartData[field] = (this.chartData[field] || []);
                if  (record[field] > 0) {
                    this.chartData[field].push([
                        time,
                        record[field],
                    ]);
                }
            }
        }
    }

    createDiskUsageChartData() {
        this.fields = this.history[0].filesystems.map(n => n.filesystem);
        for (let record of this.history) {
            let time = new Date(record.timestamp).getTime();
            for (let field of this.fields) {
                this.chartData[field] = (this.chartData[field] || []);
                this.chartData[field].push([
                    time,
                    record.filesystems.filter(f => f.filesystem === field)[0].used,
                ]);
            }
        }
    }

    createIOChartData() {
        this.fields = this.history[this.history.length - 1].devices.map(n => n.device);
        for (let record of this.history) {
            let time = new Date(record.timestamp).getTime();
            for (let field of this.fields) {
                this.chartData[field + ':read'] = (this.chartData[field + ':read'] || []);
                this.chartData[field + ':write'] = (this.chartData[field + ':write'] || []);
                this.chartData[field + ':read'].push([
                    time,
                    (record.devices.filter(f => f.device === field)[0] || { 'read': 0 }).read,
                ]);
                this.chartData[field + ':write'].push([
                    time,
                    (record.devices.filter(f => f.device === field)[0] || { 'write': 0 }).write,
                ]);
            }
        }
    }

    createCPUChartData() {
        this.fields = this.history[this.history.length - 1].cpus.map(n => n.cpu);
        for (let record of this.history) {
            let time = new Date(record.timestamp).getTime();
            for (let field of this.fields) {
                this.chartData[field] = (this.chartData[field] || []);
                let device = record.cpus.filter(f => f.cpu === field)[0] || { 'user': 0, 'system': 0 };
                this.chartData[field].push([
                    time,
                    (device.user + device.system) / 1000 * 100
                ]);
            }
        }
    }

    createNetworkChartData() {
        this.fields = this.history[this.history.length - 1].devices.map(n => n.device);
        for (let record of this.history) {
            let time = new Date(record.timestamp).getTime();
            for (let field of this.fields) {
                this.chartData[field + ':sent'] = (this.chartData[field + ':sent'] || []);
                this.chartData[field + ':received'] = (this.chartData[field + ':received'] || []);
                this.chartData[field + ':sent'].push([
                    time,
                    (record.devices.filter(f => f.device === field)[0] || { 'bytesSent': 0 }).bytesSent,
                ]);
                this.chartData[field + ':received'].push([
                    time,
                    (record.devices.filter(f => f.device === field)[0] || { 'bytesReceived': 0 }).bytesReceived,
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
                data: Object.assign([], this.chartData[this.selectedDataset])
            }]
        });
    }

}