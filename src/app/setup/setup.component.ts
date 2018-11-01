import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService, PageTitleService, UserDataService } from '../_services';

@Component({ templateUrl: 'setup.component.html', styleUrls: ['./setup.component.less'] })
export class SetupComponent implements OnInit {
    setupForm: FormGroup;
    submitted = false;
    loading = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userDataService: UserDataService,
        private pageTitle: PageTitleService) {}

    ngOnInit() {
        this.pageTitle.removePageTitle();
        this.setupForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            passwordRepeat: ['', Validators.required]
        });
    
        this.userDataService.doInit()
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'setup_required') {
                        this.router.navigate([ '/setup' ]);
                    }
                }
            )
    }

    // convenience getter for easy access to form fields
    get f() { return this.setupForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.setupForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.createUser(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                },
                error => {
                    this.error = error.message;
                    this.loading = false;
                }
            )
    }

}