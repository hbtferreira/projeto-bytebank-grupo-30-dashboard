import { Component, Input, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.scss',
})
export class HeaderDashboardComponent implements OnInit {
  @Input() name = 'Joana da Silva Oliveira';
  @Output() logout = new EventEmitter<void>();

  isProfileMenuOpen = false;

  constructor(private accountService: AccountService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-container')) {
      this.closeProfileMenu();
    }
  }

  menuItems: Array<MenuItem> = [
    { label: 'Início', route: 'dashboard/#', active: true },
    { label: 'Transferências', route: 'dashboard/#', active: false },
    { label: 'Investimentos', route: 'dashboard/#', active: false },
    { label: 'Outros Serviços', route: 'dashboard/#', active: false },
  ];

  profileMenuItems = [
    { label: 'Minha conta', action: 'account', icon: 'account_circle' },
    { label: 'Configurações', action: 'settings', icon: 'settings' },
    { label: 'Sair', action: 'logout', icon: 'logout' }
  ];

  ngOnInit(): void {}

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  handleProfileMenuAction(action: string): void {
    switch (action) {
      case 'account':
        console.log('Abrir minha conta');
        // Implementar navegação para minha conta
        break;
      case 'settings':
        console.log('Abrir configurações');
        // Implementar navegação para configurações
        break;
      case 'logout':
        this.logout.emit();
        break;
    }
    this.closeProfileMenu();
  }
}
