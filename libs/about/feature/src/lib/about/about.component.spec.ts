import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { Device } from '@capacitor/device';
import { vi } from 'vitest';

// Mock the Capacitor Device plugin
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
  };

  beforeEach(async () => {
    vi.spyOn(Device, 'getInfo').mockResolvedValue(mockDeviceInfo as any);

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display device info on init', async () => {
    // Manually trigger ngOnInit and wait for the async operation
    await component.ngOnInit();
    fixture.detectChanges();

    // Verify the signal was updated
    expect(component.deviceInfo()).toEqual(mockDeviceInfo);

    // Check if the template renders the data
    const compiled = fixture.nativeElement as HTMLElement;
    const tableRows = compiled.querySelectorAll('tbody tr');

    // We expect userAgent row + one row for each key in mockDeviceInfo
    const expectedRowCount = 1 + Object.keys(mockDeviceInfo).length;
    expect(tableRows.length).toBe(expectedRowCount);

    expect(compiled.textContent).toContain('iPhone');
    expect(compiled.textContent).toContain('Apple');
  });

  it('should contain the user agent', () => {
    expect(component.userAgent).toBeDefined();
    expect(typeof component.userAgent).toBe('string');
  });
});
