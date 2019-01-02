import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageTitleService, AgentService } from '../_services';

@Component({templateUrl: 'metric.component.html', styleUrls: ['metric.component.less']})
export class MetricComponent implements OnInit {

    private agentID: string;
    private metricID: string;

    constructor(private pageTitle: PageTitleService, private route: ActivatedRoute, private agentService: AgentService){}

    ngOnInit() {
        this.pageTitle.setPageTitle('Metric');
        this.route.params.subscribe(params => {
            this.agentID = params.agentID;
            this.metricID = params.metricID;

            // this.agentService.getMetric(this.metricID, ).
        });
    }

}