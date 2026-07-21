import { TestBed } from '@angular/core/testing';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignalRService } from '../services/signalr.service';
import { RealTimeStore } from './real-time.store';

describe('RealTimeStore', () => {
  let store: InstanceType<typeof RealTimeStore>;
  let signalRService: SignalRService;

  let connectionMock: {
    state: HubConnectionState;
    onreconnected: any;
    onreconnecting: any;
    onclose: any;
  };

  beforeEach(() => {
    connectionMock = {
      state: HubConnectionState.Disconnected,
      onreconnected: vi.fn(),
      onreconnecting: vi.fn(),
      onclose: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SignalRService,
          useValue: {
            connection: connectionMock as unknown as HubConnection,
            build: vi.fn(),
            start: vi.fn().mockResolvedValue(undefined),
            stop: vi.fn().mockResolvedValue(undefined),
          },
        },
        RealTimeStore,
      ],
    });

    signalRService = TestBed.inject(SignalRService);
    store = TestBed.inject(RealTimeStore);
  });

  it('should build the connection and start with status "Not Set"', () => {
    // Assert
    expect(signalRService.build).toHaveBeenCalled();
    expect(store.connectionStatus()).toBe('Not Set');
  });

  it('should expose the connection of the signalR service', () => {
    // Assert
    expect(store.connection()).toBe(signalRService.connection);
  });

  it('should start the connection and set the status to "On"', async () => {
    // Act
    await store.startConnection();

    // Assert
    expect(signalRService.start).toHaveBeenCalled();
    expect(store.connectionStatus()).toBe('On');
  });

  it('should not start again when the connection is already connected', async () => {
    // Arrange
    connectionMock.state = HubConnectionState.Connected;

    // Act
    await store.startConnection();

    // Assert
    expect(signalRService.start).not.toHaveBeenCalled();
    expect(store.connectionStatus()).toBe('On');
  });

  it('should stop the connection and set the status to "Off"', async () => {
    // Act
    await store.stopConnection();

    // Assert
    expect(signalRService.stop).toHaveBeenCalled();
    expect(store.connectionStatus()).toBe('Off');
  });

  it('should set the status to "Reconnecting" when the connection reconnects', () => {
    // Arrange
    const [reconnectingCallback] = connectionMock.onreconnecting.mock.calls[0];

    // Act
    reconnectingCallback();

    // Assert
    expect(store.connectionStatus()).toBe('Reconnecting');
  });

  it('should set the status to "On" when the connection has reconnected', () => {
    // Arrange
    const [reconnectedCallback] = connectionMock.onreconnected.mock.calls[0];

    // Act
    reconnectedCallback();

    // Assert
    expect(store.connectionStatus()).toBe('On');
  });

  it('should set the status to "Off" when the connection closes', () => {
    // Arrange
    const [closeCallback] = connectionMock.onclose.mock.calls[0];

    // Act
    closeCallback();

    // Assert
    expect(store.connectionStatus()).toBe('Off');
  });
});
