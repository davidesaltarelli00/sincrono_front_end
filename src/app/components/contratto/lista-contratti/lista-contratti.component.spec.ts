import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContrattiComponent } from './lista-contratti.component';

describe('ListaContrattiComponent', () => {
  let component: ListaContrattiComponent;
  let fixture: ComponentFixture<ListaContrattiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaContrattiComponent]
    });
    fixture = TestBed.createComponent(ListaContrattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
