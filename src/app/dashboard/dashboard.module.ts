import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material.module';
import { HeaderComponent } from './header/header.component';
import { UsersListComponent } from './users-list/users-list.component';


@NgModule({
  declarations: [DashboardComponent, HeaderComponent, UsersListComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule
  ]
})
export class DashboardModule { }
