import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCochesComponent } from './show-coches.component';

describe('ShowCochesComponent', () => {
  let component: ShowCochesComponent;
  let fixture: ComponentFixture<ShowCochesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCochesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCochesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
