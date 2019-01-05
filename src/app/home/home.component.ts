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

    /**
     * Convert number bytes to text
     * Use base-10 for:
     *  - network bandwidth
     *  - disk sizes
     * Use base-2 for:
     *  - ram
     * 
     * @param n 
     * @param base
     */
    byteSizeToStr(n, base=1000) {
        if (n <= base) {
            return `${Math.round(n * 100) / 100} bytes`;
        }
        n /= base;
        if (n <= base) {
            return `${Math.round(n * 100) / 100} KB`;
        }
        n /= base;
        if (n <= base) {
            return `${Math.round(n * 100) / 100} MB`;
        }
        n /= base;
        if (n <= base) {
            return `${Math.round(n * 100) / 100} GB`;
        }
        n /= base;
        return `${Math.round(n * 100) / 100} TB`;
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
        return this.byteSizeToStr((metricData.total - metricData.free)*1024, 1024) + 
            '/' + this.byteSizeToStr(metricData.total*1024, 1024);
    }

}
