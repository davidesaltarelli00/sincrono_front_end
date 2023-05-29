import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovaCommessaComponent } from './nuova-commessa.component';

describe('NuovaCommessaComponent', () => {
  let component: NuovaCommessaComponent;
  let fixture: ComponentFixture<NuovaCommessaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuovaCommessaComponent]
    });
    fixture = TestBed.createComponent(NuovaCommessaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
