import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamerPage } from './examer.page';

describe('ExamerPage', () => {
  let component: ExamerPage;
  let fixture: ComponentFixture<ExamerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExamerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
