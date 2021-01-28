import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { SalaryFormComponent } from '@app/salary/salary-form/salary-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { CoreModule } from '@core';
import { Angulartics2Module } from 'angulartics2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalaryDetailsComponent } from '@app/salary/salary-details/salary-details.component';

describe('SalaryFormComponent', () => {
  let component: SalaryFormComponent;
  let fixture: ComponentFixture<SalaryFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          FlexLayoutModule,
          MaterialModule,
          Angulartics2Module.forRoot(),
          CoreModule,
          SharedModule,
          TranslateModule.forRoot(),
          FormsModule,
          ReactiveFormsModule,
        ],
        declarations: [SalaryFormComponent, SalaryDetailsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
