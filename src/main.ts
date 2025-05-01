import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread existing appConfig
  providers: [
    ...(appConfig.providers || []), // Spread existing providers from appConfig
    provideAnimations(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }).providers || [],
  ],
}).catch((err) => console.error(err));