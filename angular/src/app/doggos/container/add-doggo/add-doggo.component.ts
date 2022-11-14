import { PlatformInformationService } from './../../../common/platform-information.service';
import { getLastAddedDoggo, getLoading } from './../../store/doggos.selectors';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { DoggosActions } from '../../store/doggos.actions';
import { Doggo } from '../../models/doggo';
import { MobileCameraService } from '../../services/mobile-camera.service';

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
