import { CommessaService } from './commessa-service.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('CommessaService', () => {
  let component: CommessaService;
  let fixture: ComponentFixture<CommessaService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommessaService]
    });
    fixture = TestBed.createComponent(CommessaService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
