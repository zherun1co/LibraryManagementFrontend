import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDialogComponent } from './author-dialog.component';

describe('AuthorDialogComponent', () => {
  let component: AuthorDialogComponent;
  let fixture: ComponentFixture<AuthorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
