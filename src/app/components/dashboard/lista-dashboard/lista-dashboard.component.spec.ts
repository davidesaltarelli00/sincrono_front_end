import { ComponentFixture, TestBed } from '@angular/core/testing';

import { listaDashboardComponent } from './lista-dashboard.component';

describe('listaDashboardComponent', () => {
  let component: listaDashboardComponent;
  let fixture: ComponentFixture<listaDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [listaDashboardComponent]
    });
    fixture = TestBed.createComponent(listaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
