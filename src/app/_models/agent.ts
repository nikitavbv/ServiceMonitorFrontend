import { Metric } from './metric';

export class Agent {

  id: number;
  projectID: number;
  name: string;
  type: string;
  properties: any;
  metrics: Metric[];
  tags: string[];

}
