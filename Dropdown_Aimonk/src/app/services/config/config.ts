import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  setConfig(config: any) {
    this.config = config;
  }

  getapiUrl(): string {
    return this.config?.API_URL;
  }
}