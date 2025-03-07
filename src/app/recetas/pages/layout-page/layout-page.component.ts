import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: './list' },
    { label: 'Buscar', icon: 'search', url: './search' },
  ]


  toggleDrawer() {
    const drawer = document.getElementById('drawer-navigation');
    if (drawer) {
      drawer.classList.toggle('-translate-x-full');
      drawer.addEventListener('mouseleave', () => {
        drawer.classList.add('-translate-x-full');
      });
    }
  }

  toggleUserMenu() {
    const userMenu = document.getElementById('dropdown-user');
    if (userMenu) {
      userMenu.classList.toggle('hidden');
      userMenu.addEventListener('mouseleave', () => {
        userMenu.classList.add('hidden')
      });
    }
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    const userRole = this.authService.currentUser?.role; 
    if (userRole == 'admin') {
      this.sidebarItems.push({ label: 'Añadir', icon: 'add', url: './new-recipe' });
    }
   }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }

  get user():User | undefined{
    return this.authService.currentUser;
  }

}
