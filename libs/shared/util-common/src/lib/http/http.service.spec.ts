import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpService } from './http.service';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    console.log(
      '@@@@@@@@@@@@@@@@@@@@@@@@@@@ Is Zone present?',
      !!(window as any).Zone,
    );
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request', () => {
    // Arrange
    const testData = { message: 'success' };
    const url = '/api/test';
    // Act
    service.get(url).subscribe((data) => {
      // Assert
      expect(data).toEqual(testData);
    });

    // Assert (Request verification)
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should perform a POST request', () => {
    // Arrange
    const testData = { id: 1 };
    const body = { name: 'Test' };
    const url = '/api/test';

    // Act
    service.post(url, body).subscribe((data) => {
      // Assert
      expect(data).toEqual(testData);
    });

    // Assert (Request verification)
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a PUT request', () => {
    // Arrange
    const testData = { id: 1, name: 'Updated' };
    const body = { name: 'Updated' };
    const url = '/api/test/1';

    // Act
    service.put(url, body).subscribe((data) => {
      // Assert
      expect(data).toEqual(testData);
    });

    // Assert (Request verification)
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a DELETE request', () => {
    // Arrange
    const url = '/api/test/1';

    // Act
    service.delete(url).subscribe();

    // Assert (Request verification)
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
