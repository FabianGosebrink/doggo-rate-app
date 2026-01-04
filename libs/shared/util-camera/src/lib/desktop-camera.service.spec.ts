import { TestBed } from '@angular/core/testing';
import { DesktopCameraService } from './desktop-camera.service';
import { DOCUMENT } from '@angular/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom, lastValueFrom } from 'rxjs';

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

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    // 1. Run any remaining timers to completion
    await vi.runOnlyPendingTimersAsync();
    // 2. Clear anything else
    vi.clearAllTimers();
    vi.restoreAllMocks();
    // 3. ONLY THEN switch back to real timers
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error if getUserMedia is not available', async () => {
    // Arrange
    mockWindow.navigator.mediaDevices = undefined;

    // Act
    const result = await lastValueFrom(service.getPhoto());

    // Assert
    expect(result).toBeNull();
  });

  it('should capture a photo and stop tracks', async () => {
    // Arrange
    const photoPromise = firstValueFrom(service.getPhoto());

    // Act
    await vi.advanceTimersByTimeAsync(300); // Replaces tick(300)
    const result = await photoPromise;

    // Assert
    expect(result).not.toBeNull();
    expect(result.base64).toContain('data:image/png;base64');
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it('should return null if getUserMedia is not available', async () => {
    // Arrange
    mockWindow.navigator.mediaDevices = undefined;

    // Act
    const result = await lastValueFrom(service.getPhoto());

    // Assert
    expect(result).toBeNull();
  });
});
