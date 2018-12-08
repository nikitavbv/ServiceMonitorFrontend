import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PageTitleService } from '../_services';

@Component({templateUrl: 'projects.component.html', styleUrls: ['projects.component.less']})
export class ProjectsComponent implements OnInit {

  constructor(private pageTitle: PageTitleService) {}

  ngOnInit() {
    this.pageTitle.setPageTitle('API Tokens');
  }

}
