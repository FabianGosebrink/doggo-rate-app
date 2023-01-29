import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PlatformInformationService } from '../../../common/platform-information/platform-information.service';
import { Doggo } from '../../models/doggo';
import { MobileCameraService } from '../../services/mobile-camera.service';
import { DoggosActions } from '../../store/doggos.actions';
import { getLastAddedDoggo, getLoading } from './../../store/doggos.selectors';

@Component({
  selector: 'app-add-doggo',
  standalone: true,
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.css'],
  imports: [AsyncPipe, RouterLink, NgIf, ReactiveFormsModule],
})
export class AddDoggoComponent implements OnInit {
  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });

  lastAddedDoggo$: Observable<Doggo>;
  loading$: Observable<boolean>;

  filename = '';

  private formData: FormData;

  get isMobile() {
    return this.platformInformationService.isMobile;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private mobileCameraService: MobileCameraService,
    private platformInformationService: PlatformInformationService
  ) {}

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

  takePhoto() {
    this.mobileCameraService.getPhoto().subscribe(({ formData, fileName }) => {
      this.formData = formData;
      this.filename = fileName;
    });
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
