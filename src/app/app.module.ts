import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ExtractComponent } from './dashboard/extract/extract.component';
import { HeaderDashboardComponent } from './dashboard/header-dashboard/header-dashboard.component';
import { BalanceComponent } from './dashboard/balance/balance.component';
import { MenuComponent } from './dashboard/menu/menu.component';
import { NewTransactionComponent } from './dashboard/new-transaction/new-transaction.component';
import { ButtonComponent } from './dashboard/button/button.component';
import { DropdownComponent } from './dashboard/new-transaction/dropdown/dropdown.component';
import { InputComponent } from './dashboard/new-transaction/input/input.component';
import { HeaderHomeComponent } from './home/header-home/header-home.component';
import { FooterComponent } from './home/footer/footer.component';
import { ContentComponent } from './home/content/content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    ExtractComponent,
    HeaderDashboardComponent,
    BalanceComponent,
    MenuComponent,
    NewTransactionComponent,
    ButtonComponent,
    DropdownComponent,
    InputComponent,
    HeaderHomeComponent,
    FooterComponent,
    ContentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,  
    MatSelectModule,
    MatButtonModule,  
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
