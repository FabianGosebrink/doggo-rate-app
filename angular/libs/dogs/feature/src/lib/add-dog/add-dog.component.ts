import { Component, inject } from '@angular/core';
import { DogFormComponent } from '@dog-rating/dogs/ui';
import { AddDogStore } from './add-dog.store';

@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.component.html',
  styleUrls: ['./add-dog.component.scss'],
  imports: [DogFormComponent],
  providers: [AddDogStore],
})
export class AddDogComponent {
  store = inject(AddDogStore);

  addDog({ name, comment, breed, formData }): void {
    this.store.addDogWithPicture({
      name,
      comment,
      breed,
      formData,
    });
  }
}
