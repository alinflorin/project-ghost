import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input('drawer') drawer: MatDrawer | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  closeSidenav(e: MouseEvent) {
    if (this.drawer?.mode === 'over') {
      this.drawer?.close().then();
    }
  }
}
