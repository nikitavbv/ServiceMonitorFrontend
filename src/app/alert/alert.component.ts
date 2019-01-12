import { Component, OnInit } from '@angular/core';
import { PageTitleService, AlertService } from '../_services';
import { Alert, Metric } from '../_models';
import { Router } from '@angular/router';

import {
    getMetricNameByType,
    getMetricSummaryFor,
} from '../_helpers';

@Component({'templateUrl': 'alert.component.html', styleUrls: ['alert.component.less']})
export class AlertComponent implements OnInit {

    private alerts: Alert[];

    getMetricNameByType = getMetricNameByType;

    constructor(
        private pageTitle: PageTitleService,
        private alertService: AlertService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.pageTitle.setPageTitle('Alerts');
        this.alertService.getAllAlerts().subscribe(data => {
            this.alerts = data.alerts.map(alert => {
                alert.alert.metric = alert.metric;
                return Object.assign(new Alert(), alert.alert);
            });
        }, console.error);
    }

    deleteAlert(alert: Alert) {
        this.alertService.deleteAlert(alert.id)
            .subscribe(data => {
                this.alerts.splice(this.alerts.indexOf(alert), 1);
            }, console.error);
    }

    openMetric(metric: Metric) {
        this.router.navigate([`agent/${metric.agent.id}/metric/${metric.id}`]);
    }

}