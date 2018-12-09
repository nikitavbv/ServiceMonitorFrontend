import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../_services';

@Component({templateUrl: 'addAgent.component.html', styleUrls: ['addAgent.component.less']})
export class AddAgentComponent implements OnInit {

  constructor(private pageTitle: PageTitleService) {}

  ngOnInit() {
    this.pageTitle.setPageTitle('Add agent');
  }

}
