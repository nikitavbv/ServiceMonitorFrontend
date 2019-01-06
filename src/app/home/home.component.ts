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

import {
    getMetricNameByType,
    getMetricSummaryFor,
    isOnline,
    getStatusText,
} from '../_helpers';

@Component({templateUrl: 'home.component.html', styleUrls: ['home.component.less']})
export class HomeComponent implements OnInit {

    Object = Object;
    json = JSON;
    console = console;

    expandedAgentID = -1;

    getMetricNameByType = getMetricNameByType;
    getMetricSummaryFor = getMetricSummaryFor;
    isOnline = isOnline;
    getStatusText = getStatusText;

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

}
