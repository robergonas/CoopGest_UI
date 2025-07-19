import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OperationRoutingModule } from './operation-routing.module';
import { OperationLayoutComponent } from './layout/operation-layout/operation-layout.component';
import { PartnerComponent } from './pages/partner/partner/partner.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { HomeComponent } from './pages/home/home.component';
import { PartnerSearchComponent } from './pages/partner/partner-search/partner-search.component';
import { DocumentTypeComponent } from '../components/document-type/document-type.component';
import { PagerComponent } from '../components/pager/pager.component';
import { PartnerListComponent } from './pages/partner/partner-list/partner-list.component';
import { ManagePartnerComponent } from './pages/partner/manage-partner/manage-partner.component';
import { LoanHeaderComponent } from './pages/loan/loan-header/loan-header.component';
import { LoanDetailComponent } from './pages/loan/loan-detail/loan-detail.component';
import { LoanComponent } from './pages/loan/loan/loan.component';
import { PaymentHeaderComponent } from './pages/pay/payment-header/payment-header.component';
import { PaymentDetailComponent } from './pages/pay/payment-detail/payment-detail.component';
import { PaymentComponent } from './pages/pay/payment/payment.component';
import { PaymentHistoryComponent } from './pages/payment-history/payment-history.component';
import { BillsComponent } from './pages/bills/bills.component';
import { UtilityComponent } from './pages/utility/utility.component';

@NgModule({
  declarations: [
    OperationLayoutComponent,
    PartnerComponent,
    FooterComponent,
    HeaderComponent,
    SideNavComponent,
    HomeComponent,
    PartnerSearchComponent,
    DocumentTypeComponent,
    PagerComponent,
    PartnerListComponent,
    ManagePartnerComponent,
    LoanHeaderComponent,
    LoanDetailComponent,
    LoanComponent,
    PaymentHeaderComponent,
    PaymentDetailComponent,
    PaymentComponent,
    PaymentHistoryComponent,
    BillsComponent,
    UtilityComponent,
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [DocumentTypeComponent, PagerComponent],
})
export class OperationModule {}
