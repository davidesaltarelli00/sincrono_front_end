import { OrganicoService } from "./organico-service";
import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('DashboardService', () => {
  let component: OrganicoService;
  let fixture: ComponentFixture<OrganicoService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganicoService]
    });
    fixture = TestBed.createComponent(OrganicoService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});