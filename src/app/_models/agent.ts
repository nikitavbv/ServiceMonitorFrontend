import { Metric } from './metric';

export class Agent {

  id: number;
  name: string;
  type: string;
  properties: any;
  metrics: Metric[];
  tags: string[];

}
