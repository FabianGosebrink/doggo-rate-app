import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  Doggo,
  DoggosActions,
  getLastAddedDoggo,
  getLoading,
} from '@ps-doggo-rating/doggos/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-doggo',
  standalone: true,
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.css'],
  imports: [AsyncPipe, RouterLink, NgIf, ReactiveFormsModule],
})
export class AddDoggoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });

  lastAddedDoggo$: Observable<Doggo>;
  loading$: Observable<boolean>;

  filename = '';

  private formData: FormData;

  ngOnInit(): void {
    this.lastAddedDoggo$ = this.store.pipe(select(getLastAddedDoggo));
    this.loading$ = this.store.pipe(select(getLoading));
  }

  setFormData(files) {
    if (files[0]) {
      const formData = new FormData();
      formData.append(files[0].name, files[0]);
      this.filename = files[0].name;
      this.formData = formData;
    }
  }

  addDoggo() {
    if (this.formGroup.valid) {
      const { name, comment, breed } = this.formGroup.value;

      this.store.dispatch(
        DoggosActions.addDoggoWithPicture({
          name,
          comment,
          breed,
          formData: this.formData,
        })
      );
    }
  }
}
