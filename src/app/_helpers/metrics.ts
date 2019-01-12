import { Agent } from '../_models';

const ONLINE_INTERVAL = 2 * 60 * 1000;

const metricTypes = {
    'memory': 'Memory',
    'diskUsage': 'Disk usage',
    'uptime': 'Uptime',
    'io': 'I/O',
    'docker': 'Docker',
    'cpu': 'CPU',
    'network': 'Network',
    'nginx': 'NGINX',
    'mysql': 'MySQL'
};

export function getMetricNameByType(metricType) {
    if (metricType in metricTypes) {
        return metricTypes[metricType];
    } else {
        return metricType;
    }
}

export function getMetricSummaryFor(metricData) {
    let metricType = metricData.type;
    if (metricType === 'memory') {
        return getMemoryMetricSummary(metricData);
    } else if (metricType === 'diskUsage') {
        return getDiskUsageMetricSummary(metricData);
    } else if (metricType === 'uptime') {
        return getUptimeMetricSummary(metricData);
    } else if (metricType === 'io') {
        return getIOMetricSummary(metricData);
    } else if (metricType === 'docker') {
        return getDockerMetricSummary(metricData);
    } else if (metricType === 'cpu') {
        return getCPUMetricSummary(metricData);
    } else if (metricType === 'network') {
        return getNetworkMetricSummary(metricData);
    } else if (metricType === 'nginx') {
        return getNginxMetricSummary(metricData);
    } else if (metricType === 'mysql') {
        return getMysqlMetricSummary(metricData);
    } else {
        return JSON.stringify(metricData);
    }
}

function getMemoryMetricSummary(metricData) {
    return byteSizeToStr((metricData.total - metricData.available)*1024, 1024) + 
        '/' + byteSizeToStr(metricData.total*1024, 1024);
}

function getDiskUsageMetricSummary(metricData) {
    let total = 0;
    let used = 0;
    metricData.filesystems.forEach(fs => {
        total += fs.total;
        used += fs.used;
    });
    return byteSizeToStr(used*1024, 1000) + '/' + byteSizeToStr(total*1024, 1000);
}

function getUptimeMetricSummary(metricData) {
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

function getIOMetricSummary(metricData) {
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

    return `Read: ${byteSizeToStr(read)}/s, Write: ${byteSizeToStr(write)}/s`;
}

function getDockerMetricSummary(metricData) {
    let totalContainers = metricData.containers.length;
    let upContainers = metricData.containers.filter(c => c.status.startsWith('Up ')).length;
    return `${upContainers}/${totalContainers} containers up`;
}

function getCPUMetricSummary(metricData) {
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

function getNetworkMetricSummary(metricData) {
    let totalSent = 0;
    let totalReceived = 0;

    metricData.devices.forEach(device => {
        totalSent += device.bytesSent;
        totalReceived += device.bytesReceived;
    });

    return `Egress: ${byteSizeToStr(totalSent)}/s, Ingress: ${byteSizeToStr(totalReceived)}/s`;
}

function getNginxMetricSummary(metricData) {
    return Math.round(metricData.requests * 100) / 100 + ' req/s';
}

function getMysqlMetricSummary(metricData) {
    return (Math.round(metricData.Questions * 100) / 100) + ' queries/s';
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
function byteSizeToStr(n, base=1000) {
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

export function isOnline(agent: Agent) {
    if (agent.type === 'endpoint') {
        return isEndpointOnline(agent);
    }

    if (agent.metrics.length === 0) {
        return false;
    }

    let newestMetric = Object.values(agent.metrics)
        .reduce((m1, m2) => new Date(m1.timestamp).getTime() > new Date(m2.timestamp).getTime() ? m1 : m2);
    return new Date().getTime() - new Date(newestMetric.timestamp).getTime() < ONLINE_INTERVAL;
}

export function getStatusText(agent: Agent) {
    if (agent.type == 'endpoint') {
        return getEndpointStatus(agent);
    }

    if (agent.metrics.length === 0) {
        return 'no metrics';
    }

    if (isOnline(agent)) {
        return 'online';
    } else {
        return 'offline';
    }
}

function isEndpointOnline(agent: Agent) {
    return agent.properties.totalErrors == 0;
}

function getEndpointStatus(agent: Agent) {
    if (agent.properties.totalRequests == 0) {
        return 'no data yet';
    }

    let uptime = (agent.properties.totalRequests - agent.properties.totalErrors) / agent.properties.totalRequests * 100;
    let avgRespTime = agent.properties.totalTime / agent.properties.totalRequests;
    return `uptime ${Math.round(uptime * 100) / 100}%, avg. resp. time: ${Math.round(avgRespTime*100) / 100}ms`;
}