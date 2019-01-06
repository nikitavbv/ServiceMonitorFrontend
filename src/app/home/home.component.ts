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
        'diskUsage': 'Disk usage',
        'uptime': 'Uptime',
        'io': 'I/O',
        'docker': 'Docker',
        'cpu': 'CPU',
        'network': 'Network',
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
        } else if (metricType === 'diskUsage') {
            return this.getDiskUsageMetricSummary(metricData);
        } else if (metricType === 'uptime') {
            return this.getUptimeMetricSummary(metricData);
        } else if (metricType === 'io') {
            return this.getIOMetricSummary(metricData);
        } else if (metricType === 'docker') {
            return this.getDockerMetricSummary(metricData);
        } else if (metricType === 'cpu') {
            return this.getCPUMetricSummary(metricData);
        } else if (metricType === 'network') {
            return this.getNetworkMetricSummary(metricData);
        } else {
            return JSON.stringify(metricData);
        }
    }

    getMemoryMetricSummary(metricData) {
        return this.byteSizeToStr((metricData.total - metricData.free)*1024, 1024) + 
            '/' + this.byteSizeToStr(metricData.total*1024, 1024);
    }

    getDiskUsageMetricSummary(metricData) {
        let total = 0;
        let used = 0;
        metricData.filesystems.forEach(fs => {
            total += fs.total;
            used += fs.used;
        });
        return this.byteSizeToStr(used*1024, 1000) + '/' + this.byteSizeToStr(total*1024, 1000);
    }

    getUptimeMetricSummary(metricData) {
        let seconds = metricData.uptime;
        if (seconds <= 60) {
            return `${Math.round(seconds * 100) / 100} s.`;
        }

        let minutes = seconds / 60;
        if (minutes <= 60) {
            return `${Math.round(minutes * 100) / 100} min.`;
        }

        let hours = minutes / 60;
        if (hours <= 24) {
            return `${Math.round(hours)} hours`;
        }

        let days = hours / 24;
        return `${Math.round(days * 100) / 100} days`;
    }

    getIOMetricSummary(metricData) {
        let devices = metricData.devices;
        let deviceNames = devices.map(d => d.device);
        devices = devices.filter(d => {
            let deviceName = d.device;
            for (let name of deviceNames) {
                if (deviceName.length > name.length && deviceName.startsWith(name)) {
                    return false;
                }
            }
            return true;
        });

        let read = 0;
        let write = 0;
        devices.forEach(d => {
            read += d.read;
            write += d.write;
        });

        return `Read: ${this.byteSizeToStr(read)}/s, Write: ${this.byteSizeToStr(write)}/s`;
    }

    getDockerMetricSummary(metricData) {
        let totalContainers = metricData.containers.length;
        let upContainers = metricData.containers.filter(c => c.status.startsWith('Up ')).length;
        return `${upContainers}/${totalContainers} containers up`;
    }

    getCPUMetricSummary(metricData) {
        let cpus = metricData.cpus;
        let cpuNames = cpus.map(c => c.cpu);
        cpus = cpus.filter(c => {
            let cpuName = c.cpu;
            for (let name of cpuNames) {
                if (cpuName.length > name.length && cpuName.startsWith(name)) {
                    return false;
                }
            }
            return true;
        });

        let totalUser = 0;
        let total = 0;
        cpus.forEach(cpu => {
            totalUser += cpu.user;
            total += 1000;
        });

        return `${Math.round((totalUser/total)*100*100)/100}% load`;
    }

    getNetworkMetricSummary(metricData) {
        let totalSent = 0;
        let totalReceived = 0;

        metricData.devices.forEach(device => {
            totalSent += device.bytesSent;
            totalReceived += device.bytesReceived;
        });

        return `Egress: ${this.byteSizeToStr(totalSent)}/s, Ingress: ${this.byteSizeToStr(totalReceived)}/s`;
    }

}
