import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {
  PageTitleService,
  ProjectService,
  UserDataService,
} from '../_services';

import {
  Project
} from '../_models';

@Component({templateUrl: 'projects.component.html', styleUrls: ['projects.component.less']})
export class ProjectsComponent implements OnInit {

  newProjectName: string = '';
  expandedProjectID: number = -1;
  updatedProjectNames: any = {};
  addUserToProjectNames: any = {};

  defaultSubscribe = [data => {}, console.error];

  constructor(
    private pageTitle: PageTitleService,
    private projectService: ProjectService,
    public userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.pageTitle.setPageTitle('Projects');
    this.projectService.getAllProjects().pipe(first()).subscribe(
      ...this.defaultSubscribe
    );
  }

  createProject() {
    this.projectService.createProject(this.newProjectName).pipe(first()).subscribe(
      ...this.defaultSubscribe
    );
  }

  showProjectExpanded(project: Project) {
    if (this.expandedProjectID === project.id) {
      this.expandedProjectID = -1;
    } else {
      this.expandedProjectID = project.id;
    }
  }

  renameProject(project: Project) {
    this.projectService.rename(project, this.updatedProjectNames[project.id]).pipe(first()).subscribe(
      ...this.defaultSubscribe
    );
  }

  deleteProject(project: Project) {
    this.projectService.deleteProject(project).pipe(first()).subscribe(...this.defaultSubscribe);
  }

  addUserToProject(project: Project) {
    this.projectService.addUserToProject(project, this.addUserToProjectNames[project.id])
      .subscribe(data => {
        this.addUserToProjectNames[project.id] = '';
      }, console.error);
  }

}
