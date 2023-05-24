import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuovoContrattoComponent } from './nuovo-contratto.component';

describe('NuovoContrattoComponent', () => {
  let component: NuovoContrattoComponent;
  let fixture: ComponentFixture<NuovoContrattoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuovoContrattoComponent]
    });
    fixture = TestBed.createComponent(NuovoContrattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
