import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDashboardComponent } from './lista-dashboard.component';

describe('listaDashboardComponent', () => {
  let component: ListaDashboardComponent;
  let fixture: ComponentFixture<ListaDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaDashboardComponent]
    });
    fixture = TestBed.createComponent(ListaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
