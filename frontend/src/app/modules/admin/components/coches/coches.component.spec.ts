import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CochesComponent } from './coches.component';

describe('CochesComponent', () => {
  let component: CochesComponent;
  let fixture: ComponentFixture<CochesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CochesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CochesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
