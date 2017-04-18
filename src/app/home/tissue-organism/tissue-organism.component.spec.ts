import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TissueOrganismComponent } from './tissue-organism.component';

describe('TissueOrganismComponent', () => {
  let component: TissueOrganismComponent;
  let fixture: ComponentFixture<TissueOrganismComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TissueOrganismComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TissueOrganismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
