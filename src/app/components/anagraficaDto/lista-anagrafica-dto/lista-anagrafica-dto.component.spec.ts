import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAnagraficaDtoComponent } from './lista-anagrafica-dto.component';

describe('ListaAnagraficaDtoComponent', () => {
  let component: ListaAnagraficaDtoComponent;
  let fixture: ComponentFixture<ListaAnagraficaDtoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaAnagraficaDtoComponent]
    });
    fixture = TestBed.createComponent(ListaAnagraficaDtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
