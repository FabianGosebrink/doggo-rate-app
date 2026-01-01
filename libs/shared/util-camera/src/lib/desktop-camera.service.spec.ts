import { TestBed, waitForAsync } from '@angular/core/testing';
import { DesktopCameraService } from './desktop-camera.service';
import { DOCUMENT } from '@angular/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('DesktopCameraService', () => {
  let service: DesktopCameraService;
  let mockWindow: any;
  let mockStream: any;
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = {
      stop: vi.fn(),
      getSettings: vi.fn().mockReturnValue({ width: 1280, height: 720 }),
    };

    mockStream = {
      getVideoTracks: vi.fn().mockReturnValue([mockTrack]),
    };

    const mockCanvas = {
      getContext: vi.fn().mockReturnValue({
        drawImage: vi.fn(),
      }),
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockData'),
      width: 0,
      height: 0,
    };

    const mockVideo = {
      play: vi.fn(),
      srcObject: null,
    };

    mockWindow = {
      navigator: {
        mediaDevices: {
          getUserMedia: vi.fn().mockResolvedValue(mockStream),
        },
      },
      document: {
        createElement: vi.fn().mockImplementation((tag) => {
          if (tag === 'canvas') return mockCanvas;
          if (tag === 'video') return mockVideo;
          return {};
        }),
      },
    };

    TestBed.configureTestingModule({
      providers: [
        DesktopCameraService,
        {
          provide: DOCUMENT,
          useValue: { defaultView: mockWindow, document: mockWindow.document },
        },
      ],
    });
    service = TestBed.inject(DesktopCameraService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error if getUserMedia is not available', waitForAsync(() => {
    // Arrange
    mockWindow.navigator.mediaDevices = undefined;

    // Act
    service.getPhoto().subscribe({
      error: (err) => {
        // Assert
        expect(err).toBe('Camera API not available');
      },
    });
  }));

  it('should capture a photo and stop tracks', async () => {
    // Arrange
    const photoPromise = firstValueFrom(service.getPhoto());

    // Act
    await vi.advanceTimersByTimeAsync(300); // Replaces tick(300)
    const result = await photoPromise;

    // Assert
    expect(result).toBeDefined();
    expect(result.base64).toContain('data:image/png;base64');
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it('should throw error if canvas context cannot be created', async () => {
    // Arrange
    const brokenCanvas = { getContext: vi.fn().mockReturnValue(null) };
    mockWindow.document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === 'canvas') return brokenCanvas;
      return { play: vi.fn(), srcObject: null };
    });

    // Act & Assert
    const photoPromise = firstValueFrom(service.getPhoto());
    await vi.advanceTimersByTimeAsync(300);

    await expect(photoPromise).rejects.toThrow('Could not get canvas context');
  });
});
