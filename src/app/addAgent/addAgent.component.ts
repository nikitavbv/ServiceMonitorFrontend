import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService, AgentService, UserDataService } from '../_services';

@Component({templateUrl: 'addAgent.component.html', styleUrls: ['addAgent.component.less']})
export class AddAgentComponent implements OnInit {

  Object = Object;

  endpointToTrack = '';
  endpointName = '';
  selectedProject = '';

  constructor(
    private pageTitle: PageTitleService, 
    private agentService: AgentService,
    private userData: UserDataService,
    private router: Router) {}

  ngOnInit() {
    this.pageTitle.setPageTitle('Add agent');
    this.userData.doInit().subscribe(() => {
      this.selectedProject = this.userData.projects[0].apiKey;
    }, console.error);
  }

  addEndpoint() {
    this.agentService.addEndpointToTrack(this.selectedProject, this.endpointName, this.endpointToTrack).subscribe(data => {
      this.router.navigate(['/']);
    }, console.error);
  }

}
