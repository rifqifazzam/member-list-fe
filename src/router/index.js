// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import axios from 'axios';

const TOKEN_VALIDATION_URL = 'http://localhost:8000/api/validate-token/'; 

// Checking token validity
const authGuard = async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    next('/login'); 
  } else {
    // Delete token at local if it is invalid, invalid means its none at the server
    try {
      await axios.get(TOKEN_VALIDATION_URL, {
        headers: { Authorization: `Token ${token}` }
      });
      next(); 
    } catch (error) {
      localStorage.removeItem('token'); 
      next('/login');
    }
  }
};

// Appling Auth guard to protected routes
const protectedRoutes = routes.map(route => {
  if (['/MemberList'].includes(route.path)) {
    return {
      ...route,
      beforeEnter: authGuard 
    }
  }
  return route;
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: protectedRoutes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
