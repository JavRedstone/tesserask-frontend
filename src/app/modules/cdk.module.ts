import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';

import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
    CdkAccordionModule,
    CdkScrollableModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,

    ScrollingModule
  ],
  exports: [
    CdkAccordionModule,
    CdkScrollableModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,

    ScrollingModule
  ]
})
export class CdkModule { }