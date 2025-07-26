import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxChartsModule, PieChartModule } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';

interface Investimento {
  tipo: string;
  valor: number;
}

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, NgxChartsModule, PieChartModule],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.scss'
})
export class InvestmentsComponent implements OnInit {
  investimentos: Investimento[] = [];
  total = 0;
  rendaFixa = 0;
  rendaVariavel = 0;

  donutData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Investimento[]>('/assets/investments.json').subscribe(investimentosJson => {
      this.investimentos = investimentosJson;
      this.total = this.investimentos.reduce((sum, inv) => sum + inv.valor, 0);
      this.rendaFixa = this.investimentos.find(i => i.tipo === 'Renda Fixa')?.valor || 0;
      this.rendaVariavel = this.investimentos.find(i => i.tipo === 'Renda Variável')?.valor || 0;

      this.donutData = [
        { name: 'Fundos de investimento', value: this.investimentos.find(i => i.tipo === 'Fundos de investimento')?.valor || 0 },
        { name: 'Tesouro Direto', value: this.investimentos.find(i => i.tipo === 'Tesouro Direto')?.valor || 0 },
        { name: 'Previdência Privada', value: this.investimentos.find(i => i.tipo === 'Previdência Privada')?.valor || 0 },
        { name: 'Bolsa de Valores', value: this.investimentos.find(i => i.tipo === 'Bolsa de Valores')?.valor || 0 }
      ];
    });
  }
}
