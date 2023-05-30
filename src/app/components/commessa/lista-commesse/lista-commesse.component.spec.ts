import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCommesseComponent } from './lista-commesse.component';

describe('ListaCommesseComponent', () => {
  let component: ListaCommesseComponent;
  let fixture: ComponentFixture<ListaCommesseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaCommesseComponent]
    });
    fixture = TestBed.createComponent(ListaCommesseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
