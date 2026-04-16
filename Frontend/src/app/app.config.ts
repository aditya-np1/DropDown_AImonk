import { ApplicationConfig, provideAppInitializer, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { ConfigService } from './services/config/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const configService = inject(ConfigService);

      return firstValueFrom(
        http.get('/assets/config.json')
      ).then((config: any) => {
        configService.setConfig(config);
      });
    })
  ]
};
