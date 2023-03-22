import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebMapComponent } from './web-map.component';

describe('WebMapComponent', () => {
  let component: WebMapComponent;
  let fixture: ComponentFixture<WebMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
