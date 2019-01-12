import { Metric } from "./metric";

export class Alert {

    id: number;
    paramName: string;
    alertCondition: string;
    level: string;
    action: string;

    metric: Metric;

    constructor(
        id?: number, paramName?: string, alertCondition?: string, 
        level?: string, action?: string
    ) {
        this.id = id;
        this.paramName = paramName;
        this.alertCondition = alertCondition;
        this.level = level;
        this.action = action;
    }

}