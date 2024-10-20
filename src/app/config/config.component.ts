import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SharedTitleService } from '../services/shared-title.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface RouteItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>(); 
  currentRoute: string = 'prfs';
  configRoutes: RouteItem[] = [
    { path: 'prfs', label: 'PRFS' },
    { path: 'prfm', label: 'PRFM' },
    { path: 'prma', label: 'PRMA' },
    { path: 'categories', label: 'Categories' },
    { path: 'users', label: 'Users perms' },
    { path: 'customers', label: 'Customers' },
    { path: 'ships', label: 'Ships' },
    { path: 'documents', label: 'Documents' },
    { path: 'pieces', label: 'Spares ' }
  ];

  // State variables for menu visibility
  isMenuVisible: boolean = false; // Toggle for mobile view
  isDesktop: boolean = false; // Check for desktop view

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedTitleService: SharedTitleService,
  ) {}

  ngOnInit() {
    // Listen for route changes
    this.route.firstChild?.url.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((segments) => {
      this.currentRoute = segments[0]?.path || '';
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.updateCurrentRoute();
    });
  
    this.sharedTitleService.changeTitle('config');

    // Check screen size on initialization
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  // Method to toggle the menu visibility for mobile devices
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  // Method to check screen size and toggle menu visibility accordingly
  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop) {
      this.isMenuVisible = true;  // Always show the menu on desktop
    } else {
      this.isMenuVisible = false;  // Hide menu by default on mobile
    }
  }

  changeUrl() { 
    this.updateCurrentRoute(); 
  }

  private updateCurrentRoute() {
    this.route.firstChild?.url.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((segments) => {
      this.currentRoute = segments[0]?.path || '';
    });
  }
}
