import { TestBed } from '@angular/core/testing';
import { HttpService } from '@dog-rating/shared/util-common';
import { MockProvider } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let httpMock: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UploadService,
        MockProvider(HttpService, {
          post: vi.fn().mockReturnValue(of({ path: 'images/dog.png' })),
        }),
      ],
    });

    service = TestBed.inject(UploadService);
    httpMock = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload the form data to the image upload endpoint', async () => {
    // Arrange
    const formData = new FormData();

    // Act
    const result = await firstValueFrom(service.upload(formData));

    // Assert
    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('api/upload/image'),
      formData,
    );
    expect(result).toEqual({ path: 'images/dog.png' });
  });
});
