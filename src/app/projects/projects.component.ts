import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {
  PageTitleService,
  ProjectService,
  UserDataService,
} from '../_services';

@Component({templateUrl: 'projects.component.html', styleUrls: ['projects.component.less']})
export class ProjectsComponent implements OnInit {

  newProjectName: string = '';

  constructor(
    private pageTitle: PageTitleService,
    private projectService: ProjectService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.pageTitle.setPageTitle('Projects');
    this.projectService.getAllProjects().pipe(first()).subscribe(data => {
      // this.projects = data.projects;
    }, error => console.error(error));
  }

  createProject() {
    this.projectService.createProject(this.newProjectName).pipe(first()).subscribe(data => {
      console.log(data);
    }, error => console.error(error));
  }

}
