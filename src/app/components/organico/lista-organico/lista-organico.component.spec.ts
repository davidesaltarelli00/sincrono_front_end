import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrganicoComponent } from './lista-organico.component';

describe('ListaOrganicoComponent', () => {
  let component: ListaOrganicoComponent;
  let fixture: ComponentFixture<ListaOrganicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaOrganicoComponent]
    });
    fixture = TestBed.createComponent(ListaOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
