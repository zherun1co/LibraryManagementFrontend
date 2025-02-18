import { HttpInterceptorFn } from "@angular/common/http";

export const httpClientInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');

  if (!token)
    return next(request);

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
}