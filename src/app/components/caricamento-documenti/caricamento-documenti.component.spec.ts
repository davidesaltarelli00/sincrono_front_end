import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaricamentoDocumentiComponent } from './caricamento-documenti.component';

describe('CaricamentoDocumentiComponent', () => {
  let component: CaricamentoDocumentiComponent;
  let fixture: ComponentFixture<CaricamentoDocumentiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaricamentoDocumentiComponent]
    });
    fixture = TestBed.createComponent(CaricamentoDocumentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
