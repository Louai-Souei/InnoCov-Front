import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      console.log('Authentication successful.');
      return true;
    } else {
      console.log('Authentication failed. Redirecting to login.');
      router.navigate(['']);
      return false;
    }
  }

  console.error('Window object is undefined. Guard cannot function properly.');
  router.navigate(['']);
  return false;
};
