import {Component, ViewChild} from '@angular/core';

import {Sidebar} from 'primeng/sidebar';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(private router: Router) {
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;

  onNavigate(route: string): void {
    this.router.navigate([route]).then(r => true);
  }
}
