import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoricoContrattiComponent } from './storico-contratti.component';

describe('StoricoContrattiComponent', () => {
  let component: StoricoContrattiComponent;
  let fixture: ComponentFixture<StoricoContrattiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoricoContrattiComponent]
    });
    fixture = TestBed.createComponent(StoricoContrattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
