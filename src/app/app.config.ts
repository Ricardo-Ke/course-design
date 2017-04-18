import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
  getWebServiceUrl(): string {
    return environment.webServiceUrl;
  }
}
