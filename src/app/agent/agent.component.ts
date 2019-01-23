import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageTitleService, AgentService } from '../_services';
import { Agent } from '../_models';

import {
    getMetricNameByType,
    getMetricSummaryFor,
    isOnline,
    getStatusText,
} from '../_helpers';

@Component({templateUrl: 'agent.component.html', styleUrls: ['agent.component.less']})
export class AgentComponent implements OnInit {

    Object = Object;
    json = JSON;

    private agentID: string;
    agent: Agent;
    private newAgentName: string;
    private newTagName: string;

    getMetricNameByType = getMetricNameByType;
    getMetricSummaryFor = getMetricSummaryFor;
    isOnline = isOnline;
    getStatusText = getStatusText;

    constructor(
        private pageTitle: PageTitleService, 
        private route: ActivatedRoute,
        private router: Router,
        private agentService: AgentService,
    ){}

    ngOnInit() {
        this.pageTitle.setPageTitle('Agent');
        this.route.params.subscribe(params => {
            this.agentID = params.agentID;
            this.agentService.getAgentById(this.agentID)
                .subscribe(data => this.agent = data, console.error);
        });
    }
  
    openMetricPage(agentID: number, metricID: number, event) {
        this.router.navigate([`agent/${agentID}/metric/${metricID}`]);
    }

    renameAgent() {
        this.agentService.renameAgent(this.agent.id.toString(), this.newAgentName)
            .subscribe(data => {
                this.agent.name = this.newAgentName;
            }, console.error);
    }

    deleteAgent() {
        this.agentService.deleteAgent(this.agent.id.toString())
            .subscribe(data => {
                this.router.navigate(['/'])
            }, console.error);
    }

    addTag() {
        this.agentService.addAgentTag(this.agentID.toString(), this.newTagName)
            .subscribe(data => {
                this.agent.tags.push(this.newTagName);
            }, console.error);
    }

    removeTag(tagToRemove: string) {
        this.agentService.removeAgentTag(this.agentID.toString(), tagToRemove)
            .subscribe(data => {
                this.agent.tags.splice(this.agent.tags.indexOf(tagToRemove), 1);
            })
    }

}
