import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAnagraficheComponent } from './lista-anagrafiche.component';

describe('ListaAnagraficheComponent', () => {
  let component: ListaAnagraficheComponent;
  let fixture: ComponentFixture<ListaAnagraficheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaAnagraficheComponent]
    });
    fixture = TestBed.createComponent(ListaAnagraficheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
