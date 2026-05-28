import { Component, inject, input, output, signal } from '@angular/core';
import { CameraService } from '@dog-rating/shared/util-camera';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

@Component({
  selector: 'lib-dog-form',
  imports: [FormRoot, FormField],
  templateUrl: './dog-form.component.html',
  styleUrl: './dog-form.component.scss',
})
export class DogFormComponent {
  readonly #cameraService = inject(CameraService);

  loading = input(false);

  dogAdded = output<{
    name: string;
    comment: string;
    breed: string;
    formData: FormData;
  }>();

  formModel = signal({
    name: '',
    breed: '',
    comment: '',
  });

  form = form(
    this.formModel,
    (formModel) => {
      required(formModel.name, { message: 'Name is required' });
      required(formModel.breed, { message: 'Breed is required' });
    },
    {
      submission: {
        action: async (field) => {
          const { name, comment, breed } = field().value();

          this.dogAdded.emit({
            name,
            comment,
            breed,
            formData: this.formData,
          });
        },
      },
    },
  );

  private formData: FormData;

  base64 = signal('');
  filename = signal('');

  setFormData(files: FileList): void {
    if (files[0]) {
      const formData = new FormData();
      console.log(files[0]);
      formData.append(files[0].name, files[0]);
      this.filename.set(files[0].name);
      this.formData = formData;
    }
  }

  takePhoto(): void {
    this.#cameraService
      .getPhoto()
      .subscribe(({ formData, fileName, base64 }) => {
        this.formData = formData;
        this.filename.set(fileName);
        this.base64.set(base64);
      });
  }
}
