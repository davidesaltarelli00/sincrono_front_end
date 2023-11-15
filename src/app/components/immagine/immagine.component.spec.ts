import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmagineComponent } from './immagine.component';

describe('ImmagineComponent', () => {
  let component: ImmagineComponent;
  let fixture: ComponentFixture<ImmagineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImmagineComponent]
    });
    fixture = TestBed.createComponent(ImmagineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
