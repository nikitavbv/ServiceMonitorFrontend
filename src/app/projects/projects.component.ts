import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {
  PageTitleService,
  ProjectService,
} from '../_services';

@Component({templateUrl: 'projects.component.html', styleUrls: ['projects.component.less']})
export class ProjectsComponent implements OnInit {

  constructor(private pageTitle: PageTitleService, private projectService: ProjectService) {}

  ngOnInit() {
    this.pageTitle.setPageTitle('Projects');
    this.projectService.getAllProjects().pipe(first()).subscribe(data => {
      console.log(data.projects);
      // this.projects = data.projects;
    }, error => console.error(error));
  }

}
