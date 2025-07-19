import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerComponent } from './pages/partner/partner/partner.component';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoanComponent } from './pages/loan/loan/loan.component';
import { PaymentComponent } from './pages/pay/payment/payment.component';
import { PaymentHistoryComponent } from './pages/payment-history/payment-history.component';
import { BillsComponent } from './pages/bills/bills.component';
import { UtilityComponent } from './pages/utility/utility.component';

const routes: Routes = [
  {
    path: '',
    component: OperationLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'partner', component: PartnerComponent },
      { path: 'loan', component: LoanComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'paymentHistory', component: PaymentHistoryComponent },
      { path: 'bills', component: BillsComponent },
      { path: 'utility', component: UtilityComponent },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
