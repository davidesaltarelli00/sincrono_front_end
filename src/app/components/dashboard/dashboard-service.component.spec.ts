import { DashboardService } from './dashboard-service.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('DashboardService', () => {
  let component: DashboardService;
  let fixture: ComponentFixture<DashboardService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardService]
    });
    fixture = TestBed.createComponent(DashboardService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
