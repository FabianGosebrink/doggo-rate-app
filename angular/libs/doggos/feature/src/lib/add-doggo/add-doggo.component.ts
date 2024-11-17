import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DoggosStore } from '@doggo-rating/doggos/domain';
import { CameraService } from '@doggo-rating/shared/util-camera';

@Component({
  selector: 'app-add-doggo',
  standalone: true,
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.scss'],
  imports: [RouterLink, ReactiveFormsModule],
})
export class AddDoggoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(DoggosStore);
  private readonly cameraService = inject(CameraService);

  private formData: FormData;

  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });
  base64 = '';
  filename = '';
  loading = this.store.loading;

  setFormData(files: FileList): void {
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

      this.store.addDoggoWithPicture({
        name,
        comment,
        breed,
        formData: this.formData,
      });
    }
  }
}
