export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { isAuthenticated } = useAuth()
  const isLoginPage = to.path === '/login'
  const authenticated = isAuthenticated()

  // Si está autenticado y trata de ir al login, redirigir
  if (authenticated && isLoginPage) {
    return navigateTo('/', { replace: true })
  }

  // Si no está autenticado y no está en login, redirigir
  if (!authenticated && !isLoginPage) {
    return navigateTo('/login', { replace: true })
  }
})
