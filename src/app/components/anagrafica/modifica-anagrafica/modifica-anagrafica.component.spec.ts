import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaAnagraficaComponent } from './modifica-anagrafica.component';

describe('ModificaAnagraficaComponent', () => {
  let component: ModificaAnagraficaComponent;
  let fixture: ComponentFixture<ModificaAnagraficaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaAnagraficaComponent]
    });
    fixture = TestBed.createComponent(ModificaAnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
