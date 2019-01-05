import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Agent, Metric } from '../_models';

import { 
    PageTitleService,
    UserDataService, 
    AgentService,
    ProjectService,
} from '../_services';

@Component({templateUrl: 'home.component.html', styleUrls: ['home.component.less']})
export class HomeComponent implements OnInit {

    Object = Object;
    json = JSON;

    metricTypes = {
        'memory': 'Memory',
    };

    expandedAgentID = -1;

    constructor(
        private router: Router,
        private pageTitle: PageTitleService, 
        private userData: UserDataService,
        private projectService: ProjectService,
    ) {}

    ngOnInit() {
        this.pageTitle.setPageTitle('Home');
        this.userData.doInit().subscribe(() => {}, console.error);
    }

    showAgentExpanded(agent) {
        this.expandedAgentID = agent.id;
    }

    openMetricPage(agentID: number, metricID: number, event) {
        console.log('metric page', agentID, metricID);
        this.router.navigate([`agent/${agentID}/metric/${metricID}`]);
    }

    isStarredMetric(metric: Metric): boolean {
        for (let project of this.userData.projects) {
            for (let starredMetric of project.starredMetrics) {
                if (starredMetric === metric.id) {
                    return true;
                }
            }
        }
        return false;
    }

    starMetric(agentID: number, metric: Metric, event) {
        event.stopPropagation();
        this.projectService.starMetric(agentID, metric).subscribe((data) => {}, error => console.error(error));
    }

    unstarMetric(agentID: number, metric: Metric, event) {
        event.stopPropagation();
        this.projectService.unstarMetric(agentID, metric).subscribe((data) => {}, console.error);
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

    getMetricByID(metricID): Metric {
        for (let agent of this.userData.agents) {
            for (let metric of Object.values(agent.metrics)) {
                if (metric.id === metricID) {
                    return metric;
                }
            }
        }
    }

    getAgentByMetricID(metricID): Agent {
        for (let agent of this.userData.agents) {
            for (let metric of Object.values(agent.metrics)) {
                if (metric.id === metricID) {
                    return agent;
                }
            }
        }
    }

    getMetricNameByType(metricType) {
        if (metricType in this.metricTypes) {
            return this.metricTypes[metricType];
        } else {
            return metricType;
        }
    }

    getMetricSummaryFor(metricData) {
        let metricType = metricData.type;
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
