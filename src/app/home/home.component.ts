import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PageTitleService, UserDataService } from '../_services';

@Component({templateUrl: 'home.component.html', styleUrls: ['home.component.less']})
export class HomeComponent implements OnInit {

    Object = Object;
    json = JSON;

    metricTypes = {
        'memory': 'Memory',
    };

    expandedAgentID = -1;

    constructor(private pageTitle: PageTitleService, private userData: UserDataService) {}

    ngOnInit() {
        this.pageTitle.setPageTitle('Home');
        this.userData.doInit().subscribe(data => {
            console.log(this.userData.agents);
        }, error => console.error(error));
    }

    showAgentExpanded(agent) {
        this.expandedAgentID = agent.id;
    }

    byteSizeToStr(n) {
        // TODO: implement this
        return '2GB';
    }

    getMetricNameByType(metricType) {
        if (metricType in this.metricTypes) {
            return this.metricTypes[metricType];
        } else {
            return metricType;
        }
    }

    getMetricSummaryFor(metricType, metricData) {
        if (metricType === 'memory') {
            return this.getMemoryMetricSummary(metricData);
        } else {
            return JSON.stringify(metricData);
        }
    }

    getMemoryMetricSummary(metricData) {
        return this.byteSizeToStr(metricData.total - metricData.used) + '/' + this.byteSizeToStr(metricData.total);
    }

}
