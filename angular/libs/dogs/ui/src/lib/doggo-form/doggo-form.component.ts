import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CameraService } from '@doggo-rating/shared/util-camera';

@Component({
  selector: 'app-doggo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './doggo-form.component.html',
  styleUrl: './doggo-form.component.scss',
})
export class DoggoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cameraService = inject(CameraService);

  loading = input<boolean>(false);

  dogAdded = output<{
    name: string;
    comment: string;
    breed: string;
    formData: FormData;
  }>();

  private formData: FormData;

  formGroup = this.fb.group({
    name: ['', Validators.required],
    breed: ['', Validators.required],
    comment: ['', Validators.required],
  });
  base64 = '';
  filename = '';

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

      this.dogAdded.emit({
        name,
        comment,
        breed,
        formData: this.formData,
      });
    }
  }
}
