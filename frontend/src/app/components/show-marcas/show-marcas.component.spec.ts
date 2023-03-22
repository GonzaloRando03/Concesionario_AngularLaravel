import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMarcasComponent } from './show-marcas.component';

describe('ShowMarcasComponent', () => {
  let component: ShowMarcasComponent;
  let fixture: ComponentFixture<ShowMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMarcasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
