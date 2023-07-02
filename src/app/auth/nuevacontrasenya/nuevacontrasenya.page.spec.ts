import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevacontrasenyaPage } from './nuevacontrasenya.page';

describe('NuevacontrasenyaPage', () => {
  let component: NuevacontrasenyaPage;
  let fixture: ComponentFixture<NuevacontrasenyaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NuevacontrasenyaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
