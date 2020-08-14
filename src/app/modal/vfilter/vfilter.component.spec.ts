import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VfilterComponent } from './vfilter.component';

describe('VfilterComponent', () => {
  let component: VfilterComponent;
  let fixture: ComponentFixture<VfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
