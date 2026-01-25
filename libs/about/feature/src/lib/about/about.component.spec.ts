import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { Device } from '@capacitor/device';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@capacitor/device', () => ({
  Device: {
    getInfo: vi.fn(),
  },
}));

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    const mockDeviceInfo = {
      model: 'iPhone 13',
      platform: 'ios',
      operatingSystem: 'ios',
      osVersion: '15.0',
      manufacturer: 'Apple',
      isVirtual: false,
      webViewVersion: '15.0',
    };

    vi.mocked(Device.getInfo).mockResolvedValue(mockDeviceInfo);

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deviceInfo', () => {
    it('should call Device.getInfo on initialization', () => {
      // Assert
      expect(Device.getInfo).toHaveBeenCalled();
    });

    it('should resolve deviceInfo signal with device information', async () => {
      // Arrange
      const expectedDeviceInfo = {
        model: 'iPhone 13',
        platform: 'ios',
        operatingSystem: 'ios',
        osVersion: '15.0',
        manufacturer: 'Apple',
        isVirtual: false,
        webViewVersion: '15.0',
      };

      // Act & Assert
      await vi.waitFor(() => {
        expect(component.deviceInfo()).toEqual(expectedDeviceInfo);
      });
    });
  });
});
