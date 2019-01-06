import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Agent } from '../_models';

@Injectable()
export class AgentService {

  constructor(private http: HttpClient) {}

  addEndpointToTrack(token: string, name: string, endpoint: string) {
    return this.http.post<any>(`/api/v1/agent`, { token, name, endpoint, type: 'endpoint' });
  }

  getAgentById(id: string) {
    return this.http.get<Agent>(`/api/v1/agent/${id}`);
  }

  renameAgent(id: string, name: string) {
    return this.http.put<any>(`/api/v1/agent/${id}`, { name });
  }

  deleteAgent(id: string) {
    return this.http.delete<any>(`/api/v1/agent/${id}`);
  }

  addAgentTag(id: string, tag: string) {
    return this.http.put<any>(`/api/v1/agent/${id}`, { 'tags.add': tag });
  }

  removeAgentTag(id: string, tag: string) {
    return this.http.put<any>(`/api/v1/agent/${id}`, { 'tags.remove': tag });
  }

}
