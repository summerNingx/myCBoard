import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamComponent } from './param.component';
import { SharedModule } from '../shared.module';

describe('ParamComponent', () => {
  let component: ParamComponent;
  let fixture: ComponentFixture<ParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamComponent ],
      imports: [SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
