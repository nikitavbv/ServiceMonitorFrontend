import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageTitleService, AgentService, MetricService } from '../_services';

@Component({templateUrl: 'metric.component.html', styleUrls: ['metric.component.less']})
export class MetricComponent implements OnInit {

    private agentID: string;
    private metricID: string;

    private MAX_CHART_POINTS = 1000;

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
            ).subscribe(console.log, console.error);
        });
    }

    getYesterday(): Date {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    }

}