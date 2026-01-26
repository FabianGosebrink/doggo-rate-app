import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { Device, DeviceInfo } from '@capacitor/device';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@capacitor/device', () => ({
  Device: {
    getInfo: vi.fn(),
  },
}));

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  const mockDeviceInfo = {
    model: 'iPhone',
    platform: 'ios',
    operatingSystem: 'ios',
    osVersion: '17.0',
    manufacturer: 'Apple',
    isVirtual: true,
    name: 'My iPhone',
    webViewVersion: '17.0',
  } as DeviceInfo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    vi.spyOn(Device, 'getInfo').mockImplementation(() =>
      Promise.resolve(mockDeviceInfo),
    );
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
