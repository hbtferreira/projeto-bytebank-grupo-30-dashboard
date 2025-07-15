import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-dashboard',
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
