import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { BalanceComponent } from './balance/balance.component';
import { ExtractComponent } from './extract/extract.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { OtherServicesComponent } from './other-services/other-services.component';
import { InvestmentsComponent } from './investments/investments.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderDashboardComponent,
    MenuComponent,
    BalanceComponent,
    ExtractComponent,
    NewTransactionComponent,
    OtherServicesComponent,
    InvestmentsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  customerName = '';
  selectedMenu = 'Início';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.account$.subscribe({
      next: (account) => {
        if (account) {
          this.customerName = account.customer.name;
        }
      },
    });

    this.accountService.loadAccount().subscribe();
  }

  onMenuSelected(label: string) {
    this.selectedMenu = label;
  }
}
