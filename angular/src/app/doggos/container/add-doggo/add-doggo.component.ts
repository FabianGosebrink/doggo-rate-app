import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { PlatformInformationService } from '../../../common/platform-information/platform-information.service';
import { MobileCameraService } from '../../services/mobile-camera.service';
import { DoggosActions } from '../../store/doggos.actions';
import { getLastAddedDoggo, getLoading } from './../../store/doggos.selectors';

@Component({
  selector: 'app-add-doggo',
  standalone: true,
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.css'],
  imports: [RouterLink, NgIf, ReactiveFormsModule],
})
export class AddDoggoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly mobileCameraService = inject(MobileCameraService);
  private readonly platformInformationService = inject(
    PlatformInformationService
  );

  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });

  lastAddedDoggo = this.store.selectSignal(getLastAddedDoggo);
  loading = this.store.selectSignal(getLoading);

  filename = '';

  private formData: FormData;

  get isMobile() {
    return this.platformInformationService.isMobile;
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
