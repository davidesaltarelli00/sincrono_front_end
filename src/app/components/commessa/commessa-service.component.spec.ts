import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommessaServiceComponent } from './commessa-service.component';

describe('CommessaServiceComponent', () => {
  let component: CommessaServiceComponent;
  let fixture: ComponentFixture<CommessaServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommessaServiceComponent]
    });
    fixture = TestBed.createComponent(CommessaServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
