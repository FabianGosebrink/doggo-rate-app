import { Component, inject } from '@angular/core';
import { DoggosStore } from '@doggo-rating/doggos/domain';
import { DoggoFormComponent } from '@doggo-rating/doggos/ui';

@Component({
  selector: 'app-add-doggo',
  standalone: true,
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.scss'],
  imports: [DoggoFormComponent],
})
export class AddDoggoComponent {
  store = inject(DoggosStore);

  addDoggo({ name, comment, breed, formData }): void {
    this.store.addDoggoWithPicture({
      name,
      comment,
      breed,
      formData,
    });
  }
}
