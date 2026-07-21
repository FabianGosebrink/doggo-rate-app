import { TestBed } from '@angular/core/testing';
import { Camera } from '@capacitor/camera';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileCameraService } from './mobile-camera.service';

vi.mock('@capacitor/camera', () => ({
  Camera: {
    getPhoto: vi.fn(),
  },
  CameraResultType: { Base64: 'base64' },
}));

describe('MobileCameraService', () => {
  let service: MobileCameraService;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [MobileCameraService],
    });

    service = TestBed.inject(MobileCameraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should take a photo and return it as form data', async () => {
    // Arrange
    vi.mocked(Camera.getPhoto).mockResolvedValue({
      base64String: 'AAAA',
      format: 'jpeg',
    } as Awaited<ReturnType<typeof Camera.getPhoto>>);

    // Act
    const result = await firstValueFrom(service.getPhoto());

    // Assert
    expect(Camera.getPhoto).toHaveBeenCalledWith({
      quality: 90,
      allowEditing: false,
      resultType: 'base64',
    });
    expect(result.base64).toBe('AAAA');
    expect(result.fileName).toContain('mobile');
    expect(result.fileName.endsWith('.jpg')).toBe(true);
    expect(result.formData.get(result.fileName)).toBeInstanceOf(File);
  });
});
