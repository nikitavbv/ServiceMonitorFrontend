import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AgentService {

  constructor(private http: HttpClient) {}

  addEndpointToTrack(token: string, name: string, endpoint: string) {
    return this.http.post<any>(`/api/v1/agent`, { token, name, endpoint, type: 'endpoint' });
  }

}
