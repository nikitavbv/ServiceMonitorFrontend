import { Component, OnInit, ApplicationRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Agent, Metric } from '../_models';

import { 
    PageTitleService,
    UserDataService, 
    AgentService,
    ProjectService,
    SearchService,
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

    filteredAgents = [];
    queryString = '';

    constructor(
        private router: Router,
        private pageTitle: PageTitleService, 
        userData: UserDataService,
        private projectService: ProjectService,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.pageTitle.setPageTitle('Home');
        this.userData.doInit().subscribe(() => {
            this.filteredAgents = this.userData.agents;
        }, console.error);
        this.searchService.searchListener = this.onSearchQuery.bind(this);
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

    starMetric(projectID: number, metric: Metric, event) {
        event.stopPropagation();
        this.projectService.starMetric(projectID, metric).subscribe((data) => {}, error => console.error(error));
    }

    unstarMetric(projectID: number, metric: Metric, event) {
        event.stopPropagation();
        this.projectService.unstarMetric(projectID, metric).subscribe((data) => {}, console.error);
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

    onSearchQuery(query) {
        this.queryString = query;
        if (query.replace(/ /g, '') === '') {
            this.filteredAgents = this.userData.agents;
            return;
        }

        let words = [];
        let agentTypes = [];
        let metricTypes = [];
        let tags = [];
        query.split(' ').forEach(word => {
            if (word.replace(/ /g, '') === '') {
                return;
            }
            if (!word.startsWith(':')) {
                words.push(word);
                return;
            }
            if (word === ':agent') {
                agentTypes.push('generic');
            }
            if (word === ':endpoint') {
                agentTypes.push('endpoint');
            }
            if (word.startsWith(':type=')) {
                metricTypes.push(word.replace(':type=', ''));
            }
            if (word.startsWith(':tag=')) {
                tags.push(word.replace(':tag=', ''));
            }
        });

        this.filteredAgents = [];
        for (let agent of this.userData.agents) {
            let agentMatched = false;
            let fullMetrics = false;
            for (let word of words) {
                if (agent.name.toLowerCase().includes(word.toLowerCase())) {
                    agentMatched = true;
                    fullMetrics = true;
                    break;
                }
                for (let property of Object.values(agent.properties)) {
                    if (property.toString().includes(word)) {
                        agentMatched = true;
                        fullMetrics = true;
                        break;
                    }
                }
            }
            if (agentTypes.includes(agent.type)) {
                agentMatched = true;
                fullMetrics = true;
            }
            for (let tag of tags) {
                if (agent.tags.includes(tag)) {
                    agentMatched = true;
                    fullMetrics = true;
                }
            }

            let metricsSelected = {};
            if (!fullMetrics) {
                for (let metricType of Object.keys(agent.metrics)) {
                    let metric = agent.metrics[metricType];
                    if (metricTypes.includes(metricType)) {
                        metricsSelected[metricType] = metric;
                        agentMatched = true;
                    }
                }
            } else {
                metricsSelected = agent.metrics;
            }

            if (agentMatched) {
                this.filteredAgents.push(Object.assign({}, agent, {
                    metrics: metricsSelected,
                }));
            }
        }
    }

}
