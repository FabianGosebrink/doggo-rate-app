import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogFormComponent } from './dog-form.component';
import { MockProvider } from 'ng-mocks';
import { CameraService } from '@dog-rating/shared/util-camera';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DogFormComponent', () => {
  let component: DogFormComponent;
  let fixture: ComponentFixture<DogFormComponent>;
  let cameraService: CameraService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogFormComponent, ReactiveFormsModule],
      providers: [MockProvider(CameraService, { getPhoto: vi.fn() })],
    }).compileComponents();

    fixture = TestBed.createComponent(DogFormComponent);
    component = fixture.componentInstance;
    cameraService = TestBed.inject(CameraService);
  });

  describe('setFormData', () => {
    it('should set filename and internal formData when a file is provided', () => {
      // Arrange
      const file = new File(['content'], 'dog.png', { type: 'image/png' });
      const fileList = { 0: file, length: 1 } as unknown as FileList;

      // Act
      component.setFormData(fileList);

      // Assert
      expect(component.filename).toBe('dog.png');
    });

    it('should not update filename if no file is provided', () => {
      // Arrange
      component.filename = 'existing.png';
      const fileList = { length: 0 } as unknown as FileList;

      // Act
      component.setFormData(fileList);

      // Assert
      expect(component.filename).toBe('existing.png');
    });
  });

  describe('takePhoto', () => {
    it('should update component properties when camera service returns data', () => {
      // Arrange
      const mockResult = {
        formData: new FormData(),
        fileName: 'captured.jpg',
        base64: 'data:image/jpg;base64,123',
      };
      vi.spyOn(cameraService, 'getPhoto').mockReturnValue(of(mockResult));

      // Act
      component.takePhoto();

      // Assert
      expect(component.filename).toBe('captured.jpg');
      expect(component.base64).toBe('data:image/jpg;base64,123');
    });
  });

  describe('addDog', () => {
    it('should emit dogAdded event with form values and the formData from a file', () => {
      // Arrange
      const emitSpy = vi.spyOn(component.dogAdded, 'emit');
      const file = new File(['content'], 'dog.png', { type: 'image/png' });
      const fileList = { 0: file, length: 1 } as unknown as FileList;

      component.setFormData(fileList);
      component.formGroup.setValue({
        name: 'Rex',
        breed: 'German Shepherd',
        comment: 'Very brave',
      });

      // Act
      component.addDog();

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Rex',
          comment: 'Very brave',
          breed: 'German Shepherd',
          formData: expect.any(FormData),
        }),
      );
    });

    it('should NOT emit dogAdded event if the form is invalid', () => {
      // Arrange
      const emitSpy = vi.spyOn(component.dogAdded, 'emit');
      component.formGroup.setValue({
        name: '', // Required field missing
        breed: 'Husky',
        comment: 'Loud',
      });

      // Act
      component.addDog();

      // Assert
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
