import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificaContrattoComponent } from './modifica-contratto.component';

describe('ModificaContrattoComponent', () => {
  let component: ModificaContrattoComponent;
  let fixture: ComponentFixture<ModificaContrattoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaContrattoComponent],
    });
    fixture = TestBed.createComponent(ModificaContrattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
