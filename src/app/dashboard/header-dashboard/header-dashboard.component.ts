import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountService } from '../../services/account.service';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.scss',
})
export class HeaderDashboardComponent implements OnInit {
  @Input() name = 'Joana da Silva';
  isEditingName = false;
  temporaryName = '';

  constructor(private accountService: AccountService) {}

  menuItems: Array<MenuItem> = [
    { label: 'Início', route: 'dashboard/#', active: true },
    { label: 'Transferências', route: 'dashboard/#', active: false },
    { label: 'Investimentos', route: 'dashboard/#', active: false },
    { label: 'Outros Serviços', route: 'dashboard/#', active: false },
  ];

  ngOnInit(): void {
    this.accountService.loadAccount().subscribe({
      next: (account) => {
        this.name = account.customer.name;
      },
      error: (err) => {
        console.error('Erro ao carregar conta:', err);
      },
    });
    this.temporaryName = this.name;
  }

  updateCustomerName(newName: string): void {
    if (newName && newName.trim() !== '') {
      this.accountService.updateAccountName('1', newName.trim()).subscribe({
        next: (account) => {
          this.name = account.customer.name;
          this.isEditingName = false;
        },
        error: (err) => {
          console.error('Erro ao atualizar nome:', err);
        },
      });
    }
  }
}
