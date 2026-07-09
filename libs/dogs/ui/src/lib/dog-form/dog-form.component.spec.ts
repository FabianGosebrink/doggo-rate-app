import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogFormComponent } from './dog-form.component';
import { MockProvider } from 'ng-mocks';
import { CameraService } from '@dog-rating/shared/util-camera';
import { submit } from '@angular/forms/signals';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DogFormComponent', () => {
  let component: DogFormComponent;
  let fixture: ComponentFixture<DogFormComponent>;
  let cameraService: CameraService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogFormComponent],
      providers: [MockProvider(CameraService, { getPhoto: vi.fn() })],
    }).compileComponents();

    fixture = TestBed.createComponent(DogFormComponent);
    component = fixture.componentInstance;
    cameraService = TestBed.inject(CameraService);
  });

  describe('setFormData', () => {
    it('should set filename and internal formData when a file is provided', () => {
      const file = new File(['content'], 'dog.png', { type: 'image/png' });
      const fileList = { 0: file, length: 1 } as unknown as FileList;

      component.setFormData(fileList);

      expect(component.filename()).toBe('dog.png');
    });

    it('should not update filename if no file is provided', () => {
      component.filename.set('existing.png');
      const fileList = { length: 0 } as unknown as FileList;

      component.setFormData(fileList);

      expect(component.filename()).toBe('existing.png');
    });
  });

  describe('takePhoto', () => {
    it('should update component properties when camera service returns data', () => {
      const mockResult = {
        formData: new FormData(),
        fileName: 'captured.jpg',
        base64: 'data:image/jpg;base64,123',
      };
      vi.spyOn(cameraService, 'getPhoto').mockReturnValue(of(mockResult));

      component.takePhoto();

      expect(component.filename()).toBe('captured.jpg');
      expect(component.base64()).toBe('data:image/jpg;base64,123');
    });
  });

  describe('form submission', () => {
    it('should emit dogAdded with form values and formData when form is valid', async () => {
      const emitSpy = vi.spyOn(component.dogAdded, 'emit');
      const file = new File(['content'], 'dog.png', { type: 'image/png' });
      const fileList = { 0: file, length: 1 } as unknown as FileList;

      component.setFormData(fileList);
      component.formModel.set({
        name: 'Rex',
        breed: 'German Shepherd',
        comment: 'Very brave',
      });

      await submit(component.form);

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Rex',
          comment: 'Very brave',
          breed: 'German Shepherd',
          formData: expect.any(FormData),
        }),
      );
    });

    it('should NOT emit dogAdded when form is invalid', async () => {
      const emitSpy = vi.spyOn(component.dogAdded, 'emit');
      component.formModel.set({
        name: '',
        breed: 'Husky',
        comment: 'Loud',
      });

      await submit(component.form);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit dogAdded when the photo was never captured', async () => {
      // Arrange
      const emitSpy = vi.spyOn(component.dogAdded, 'emit');
      // Passes the "photo required" validator without going through
      // setFormData/takePhoto, so the internal formData stays unset.
      component.filename.set('dog.png');
      component.formModel.set({
        name: 'Rex',
        breed: 'German Shepherd',
        comment: 'Very brave',
      });

      // Act
      await submit(component.form);

      // Assert
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
