import { Component, Output, EventEmitter } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() menuSelected = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { label: 'Início', route: 'dashboard/#', active: true },
    { label: 'Transferências', route: 'dashboard/#', active: false },
    { label: 'Investimentos', route: 'dashboard/#', active: false },
    { label: 'Outros Serviços', route: 'dashboard/#', active: false }
  ];

  selectMenu(item: MenuItem) {
    this.menuItems.forEach(i => i.active = false);
    item.active = true;
    this.menuSelected.emit(item.label);
  }
}
