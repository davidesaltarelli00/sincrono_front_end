import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnagraficaComponent } from './anagrafica.component';

describe('AnagraficaComponent', () => {
  let component: AnagraficaComponent;
  let fixture: ComponentFixture<AnagraficaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnagraficaComponent]
    });
    fixture = TestBed.createComponent(AnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
