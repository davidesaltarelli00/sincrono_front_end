import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisultatiFilterOrganicoComponent } from './risultati-filter-organico.component';

describe('RisultatiFilterOrganicoComponent', () => {
  let component: RisultatiFilterOrganicoComponent;
  let fixture: ComponentFixture<RisultatiFilterOrganicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RisultatiFilterOrganicoComponent]
    });
    fixture = TestBed.createComponent(RisultatiFilterOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
