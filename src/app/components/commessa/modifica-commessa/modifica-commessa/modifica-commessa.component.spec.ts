import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaCommessaComponent } from './modifica-commessa.component';

describe('ModificaCommessaComponent', () => {
  let component: ModificaCommessaComponent;
  let fixture: ComponentFixture<ModificaCommessaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaCommessaComponent]
    });
    fixture = TestBed.createComponent(ModificaCommessaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
