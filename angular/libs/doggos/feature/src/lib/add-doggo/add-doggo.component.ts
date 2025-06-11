import { Component, inject } from '@angular/core';
import { DoggoFormComponent } from '@doggo-rating/doggos/ui';
import { AddDoggoStore } from './add-doggo.store';

@Component({
  selector: 'app-add-doggo',
  templateUrl: './add-doggo.component.html',
  styleUrls: ['./add-doggo.component.scss'],
  imports: [DoggoFormComponent],
  providers: [AddDoggoStore],
})
export class AddDoggoComponent {
  store = inject(AddDoggoStore);

  addDoggo({ name, comment, breed, formData }): void {
    this.store.addDoggoWithPicture({
      name,
      comment,
      breed,
      formData,
    });
  }
}
