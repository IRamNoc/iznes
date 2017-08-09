import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.css']
})
export class NavigationSidebarComponent implements OnInit {

  constructor (
      private router:Router
  ) {
      /* Stub. */
  }

  ngOnInit() {
  }

  /**
   * Active Route
   * Returns whether a string in in the ac
   * @param  {route}  - string
   * @return {active} - boolean
   */
  public activeRoute ( route ):boolean {
      return !!(this.router.url.indexOf( route ) !== -1);
  }

}
