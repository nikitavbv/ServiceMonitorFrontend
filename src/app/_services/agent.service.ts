import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AgentService {

  constructor(private http: HttpClient) {}

}
