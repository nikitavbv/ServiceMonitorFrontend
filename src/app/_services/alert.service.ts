import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AlertService {

    constructor(private http: HttpClient) {}

    getAllAlerts() {
        return this.http.get<any>('/api/v1/alert');
    }

    addAlert(
        agentID: number, metricID: number, paramName: string, 
        condition: string, conditionLevel: number, alertAction: string
    ) {
        const body = { agentID, metricID, paramName, condition, conditionLevel, alertAction };
        return this.http.post<any>('/api/v1/alert', body);
    }

    deleteAlert(alertID: number) {
        return this.http.delete<any>(`/api/v1/alert/${alertID}`);
    }

}