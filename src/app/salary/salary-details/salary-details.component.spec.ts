import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { SalaryDetailsComponent } from '@app/salary/salary-details/salary-details.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SalaryDetailsComponent', () => {
  let component: SalaryDetailsComponent;
  let fixture: ComponentFixture<SalaryDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          FlexLayoutModule,
          MaterialModule,
          HttpClientTestingModule,
          TranslateModule.forRoot(),
        ],
        declarations: [SalaryDetailsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
