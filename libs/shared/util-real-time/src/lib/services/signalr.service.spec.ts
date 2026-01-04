import { TestBed } from '@angular/core/testing';
import { SignalRService } from './signalr.service';
import * as signalR from '@microsoft/signalr';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// 1. Create the mock objects
const mockConnection = {
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn().mockResolvedValue(undefined),
};

const mockBuilder = {
  withUrl: vi.fn().mockReturnThis(),
  withAutomaticReconnect: vi.fn().mockReturnThis(),
  configureLogging: vi.fn().mockReturnThis(),
  build: vi.fn().mockReturnValue(mockConnection),
};

// 2. Mock the module using a real function declaration for the constructor
vi.mock('@microsoft/signalr', () => {
  return {
    // Use a standard function so it can be used with 'new'
    HubConnectionBuilder: vi.fn(function () {
      return mockBuilder;
    }),
    LogLevel: { Information: 1 },
  };
});

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [SignalRService],
    });
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build the connection with correct configuration', () => {
    // Act
    service.build();

    // Assert
    expect(signalR.HubConnectionBuilder).toHaveBeenCalled();
    expect(mockBuilder.withUrl).toHaveBeenCalledWith(
      expect.stringContaining('dogHub'),
    );
    expect(mockBuilder.withAutomaticReconnect).toHaveBeenCalled();
    expect(mockBuilder.build).toHaveBeenCalled();
    expect(service.connection).toBe(mockConnection);
  });

  it('should start the connection', async () => {
    // Arrange
    service.build();

    // Act
    await service.start();

    // Assert
    expect(mockConnection.start).toHaveBeenCalled();
  });

  it('should stop the connection', async () => {
    // Arrange
    service.build();

    // Act
    await service.stop();

    // Assert
    expect(mockConnection.stop).toHaveBeenCalled();
  });
});
