import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
var pendingRequest = 0;
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.showLoading();
  pendingRequest = pendingRequest + 1;

  const handleHideLoading = () => {
    pendingRequest = pendingRequest - 1;
    if (pendingRequest === 0) {
      loadingService.hideLoading();
    }
  };

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          handleHideLoading();
        }
      },
      error: (_) => {
        handleHideLoading();
      },
    })
  );
};
