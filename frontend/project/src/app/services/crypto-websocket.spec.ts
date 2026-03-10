import { TestBed } from '@angular/core/testing';

import { CryptoWebsocket } from './crypto-websocket';

describe('CryptoWebsocket', () => {
  let service: CryptoWebsocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoWebsocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
