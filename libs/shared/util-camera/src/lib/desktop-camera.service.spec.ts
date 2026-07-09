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
  let mockVideo: any;

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

    // The new captureFrame() flow listens for `onloadedmetadata` and `onplaying`
    // on the video element, then schedules a setTimeout + requestAnimationFrame
    // before drawing. Mock the video element so assigning a handler fires it on
    // the next microtask, simulating the real DOM event flow.
    mockVideo = {
      srcObject: null,
      muted: false,
      playsInline: false,
      videoWidth: 1280,
      videoHeight: 720,
      play: vi.fn().mockResolvedValue(undefined),
    };
    Object.defineProperty(mockVideo, 'onloadedmetadata', {
      set(fn) {
        this._lm = fn;
        queueMicrotask(() => fn?.());
      },
      get() {
        return this._lm;
      },
    });
    Object.defineProperty(mockVideo, 'onplaying', {
      set(fn) {
        this._pl = fn;
        queueMicrotask(() => fn?.());
      },
      get() {
        return this._pl;
      },
    });

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
      setTimeout: (cb: () => void, ms: number) => setTimeout(cb, ms),
      requestAnimationFrame: (cb: () => void) => {
        queueMicrotask(cb);
        return 0;
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
    await vi.runOnlyPendingTimersAsync();
    vi.clearAllTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error if getUserMedia is not available', async () => {
    mockWindow.navigator.mediaDevices = undefined;

    const result = await lastValueFrom(service.getPhoto());

    expect(result).toBeNull();
  });

  it('should return null if the stream has no video tracks', async () => {
    // Arrange
    mockStream.getVideoTracks.mockReturnValue([]);

    // Act
    const result = await lastValueFrom(service.getPhoto());

    // Assert
    expect(result).toBeNull();
  });

  it('should return null when getUserMedia rejects', async () => {
    // Arrange
    mockWindow.navigator.mediaDevices.getUserMedia = vi
      .fn()
      .mockRejectedValue(new Error('Permission denied'));

    // Act
    const result = await lastValueFrom(service.getPhoto());

    // Assert
    expect(result).toBeNull();
  });

  it('should clean up and return null when the canvas has no 2d context', async () => {
    // Arrange
    mockWindow.document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === 'canvas') return { getContext: vi.fn().mockReturnValue(null) };
      if (tag === 'video') return mockVideo;
      return {};
    });
    const photoPromise = firstValueFrom(service.getPhoto());

    // Act
    await vi.advanceTimersByTimeAsync(1500);
    const result = await photoPromise;

    // Assert
    expect(result).toBeNull();
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it('should clean up and return null when the video fails to play', async () => {
    // Arrange
    mockVideo.play = vi.fn().mockRejectedValue(new Error('Play failed'));

    // Act
    const result = await lastValueFrom(service.getPhoto());

    // Assert
    expect(result).toBeNull();
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it('should capture a photo and stop tracks', async () => {
    const photoPromise = firstValueFrom(service.getPhoto());

    // Advance past the 1500ms warmup; fake-timer advancement also flushes
    // the microtasks queued by onloadedmetadata/onplaying setters and by
    // requestAnimationFrame.
    await vi.advanceTimersByTimeAsync(1500);

    const result = await photoPromise;

    expect(result).not.toBeNull();
    expect(result?.base64).toContain('data:image/png;base64');
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it('should fall back to 1280x720 when the video reports no dimensions', async () => {
    // Arrange
    mockVideo.videoWidth = 0;
    mockVideo.videoHeight = 0;
    const mockCanvas = mockWindow.document.createElement('canvas');
    const photoPromise = firstValueFrom(service.getPhoto());

    // Act
    await vi.advanceTimersByTimeAsync(1500);
    await photoPromise;

    // Assert
    expect(mockCanvas.width).toBe(1280);
    expect(mockCanvas.height).toBe(720);
  });
});
