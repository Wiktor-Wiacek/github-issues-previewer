import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ButtonPageComponent } from './button-page.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

const routes = [
  {
    path: '',
    loadComponent: () =>
      import('./button-page.component').then((m) => m.ButtonPageComponent),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('../table-page/table-page.component').then(
        (m) => m.TablePageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];

describe('ButtonPageComponent', () => {
  let component: ButtonPageComponent;
  let fixture: ComponentFixture<ButtonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPageComponent, MatButtonModule],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to /table url', waitForAsync(
    inject([Location], (location: Location) => {
      fixture.debugElement.query(By.css('a')).nativeElement.click();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/table');
      });
    })
  ));
});
