import { getLastAddedDoggo } from './../../store/doggos.selectors';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { DoggosActions } from '../../store/doggos.actions';
import { Doggo } from '../../models/doggo';

@Component({
  selector: 'app-add-doggo',
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.css'],
})
export class AddDoggoComponent implements OnInit {
  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });

  lastAddedDoggo$: Observable<Doggo>;

  filename = '';

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.lastAddedDoggo$ = this.store.pipe(select(getLastAddedDoggo));
  }

  setFilename(files) {
    if (files[0]) {
      this.filename = files[0].name;
    }
  }

  addDoggo(files) {
    if (this.formGroup.valid) {
      const formData = new FormData();

      if (files[0]) {
        formData.append(files[0].name, files[0]);
      }

      const { name, comment, breed } = this.formGroup.value;

      this.store.dispatch(
        DoggosActions.addDoggoWithPicture({ name, comment, breed, formData })
      );
    }
  }
}
