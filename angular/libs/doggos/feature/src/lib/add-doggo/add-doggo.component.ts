import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { DoggosActions, getLoading } from '@ps-doggo-rating/doggos/domain';
import { CameraService } from '@ps-doggo-rating/shared/util-camera';
import { PlatformInformationService } from '@ps-doggo-rating/shared/util-platform-information';

@Component({
  selector: 'app-add-doggo',
  standalone: true,
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.scss'],
  imports: [RouterLink, ReactiveFormsModule],
})
export class AddDoggoComponent {
  private readonly fb = inject(FormBuilder);

  private readonly store = inject(Store);

  private readonly cameraService = inject(CameraService);

  private readonly platformInformationService = inject(
    PlatformInformationService
  );

  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });

  loading = this.store.selectSignal(getLoading);

  filename = '';

  base64 = '';

  get isMobile(): boolean {
    return this.platformInformationService.isMobile;
  }

  private formData: FormData;

  setFormData(files): void {
    if (files[0]) {
      const formData = new FormData();
      console.log(files[0]);
      formData.append(files[0].name, files[0]);
      this.filename = files[0].name;
      this.formData = formData;
    }
  }

  takePhoto(): void {
    this.cameraService
      .getPhoto()
      .subscribe(({ formData, fileName, base64 }) => {
        this.formData = formData;
        this.filename = fileName;
        this.base64 = base64;
      });
  }

  addDoggo(): void {
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
