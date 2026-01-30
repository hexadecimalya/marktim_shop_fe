import { useUserStore } from '~/stores/useUserStore'

export interface SsoTokenResponse {
  access_token: string
  refresh_token?: string
  id_token?: string
  expires_in?: number
}

export function useAuthFetchData<T = any>(
  url: string | Ref<string> | (() => string),
  opts?: Parameters<typeof $fetch<T>>[1]
) {
  const userStore = useUserStore()
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.apiBase

  const data = ref<T | null>(null)
  const error = ref<any>(null)
  const loading = ref(false)

  // ensure store initialized from cookies
  if (!userStore.user.access_token) {
    userStore.initStore()
  }

  async function tryRefresh(): Promise<boolean> {
    const refreshToken = userStore.user.refresh_token
    if (!refreshToken) return false

    try {
      const resp = await $fetch<SsoTokenResponse>('auth/token/refresh/', {
        baseURL,
        method: 'POST',
        body: { refresh_token: refreshToken }
      })

      if (resp?.access_token) {
        userStore.renewAccessToken(resp)
        if (resp.refresh_token) {
          userStore.renewRefreshToken(resp)
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const load = async () => {
    loading.value = true
    error.value = null

    try {
      const finalUrl =
        typeof url === 'function'
          ? url()
          : isRef(url)
            ? url.value
            : url

      const options: Parameters<typeof $fetch<T>>[1] = {
        baseURL,
        ...opts,
        headers: {
          ...(opts?.headers ?? {}),
          ...(userStore.user.access_token
            ? { Authorization: `Bearer ${userStore.user.access_token}` }
            : {})
        }
      }

      data.value = await $fetch<T>(finalUrl, options)
    } catch (err: any) {
      const status = err?.status || err?.response?.status

      if (status === 401) {
        const refreshed = await tryRefresh()

        if (refreshed) {
          data.value = await $fetch<T>(
            typeof url === 'function'
              ? url()
              : isRef(url)
                ? url.value
                : url,
            {
              baseURL,
              ...opts,
              headers: {
                ...(opts?.headers ?? {}),
                Authorization: `Bearer ${userStore.user.access_token}`
              }
            }
          )
        } else {
          userStore.logOut()
          await navigateTo('/admin2/login')
        }
      } else {
        error.value = err
      }
    } finally {
      loading.value = false
    }
  }

  // auto-refetch on URL change
  if (isRef(url) || typeof url === 'function') {
    watch(url as any, load, { immediate: true })
  } else {
    load()
  }

  return {
    data,
    error,
    loading,
    refresh: load
  }
}