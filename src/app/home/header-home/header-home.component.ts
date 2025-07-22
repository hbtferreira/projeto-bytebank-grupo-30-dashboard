import { Component } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { MatDialog } from '@angular/material/dialog';
import { OpenAccountModalComponent } from '../open-account-modal/open-account-modal.component';


@Component({
  selector: 'app-header-home',
  templateUrl: './header-home.component.html',
  styleUrl: './header-home.component.scss',
})
export class HeaderHomeComponent {

  constructor(private dialog: MatDialog) {}

  menuItems: Array<MenuItem> = [
    { label: 'Sobre', route: 'dashboard/#', active: true },
    { label: 'Serviços', route: 'dashboard/#', active: false },
    { label: 'Abrir minha conta', route: '/', active: false, class: 'header__action header__action--primary' },
    { label: 'Já tenho conta', route: 'dashboard/#', active: false, class: 'header__action header__action--secondary' },
  ];

  openAccountModal() {
    this.dialog.open(OpenAccountModalComponent, {
      width: '420px',
      panelClass: 'custom-modal'
    });
  }

openAccountClick(item: any, event: Event): void {
  
  if (item.label === 'Abrir minha conta') {
    event.preventDefault();
    console.log('Abrir minha conta selecionado');
    this.onMenuItemClick(item, event);
  }
}

  onMenuItemClick(item: any, event: Event): void {
    event.preventDefault();
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    if (item.label === 'Abrir minha conta') {
      this.openAccountModal();
    }
  }
}
