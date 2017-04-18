import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotWordsComponent } from './hot-words.component';

describe('HotWordsComponent', () => {
  let component: HotWordsComponent;
  let fixture: ComponentFixture<HotWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotWordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
