import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAccountModalComponent } from './open-account-modal.component';

describe('OpenAccountModalComponent', () => {
  let component: OpenAccountModalComponent;
  let fixture: ComponentFixture<OpenAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenAccountModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
