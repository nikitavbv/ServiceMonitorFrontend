import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class MetricService {

    constructor(private http: HttpClient) {}

    getMetric(id: number, from: number, to: number, points: number) {
        let params = new HttpParams()
            .set('from', from.toString())
            .set('to', to.toString())
            .set('points', points.toString());
        return this.http.get<any>(`/api/v1/metric/${id}`, { params: params });
    }

}