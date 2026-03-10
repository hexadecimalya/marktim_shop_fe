
import { useUserStore } from '~/stores/useUserStore'
import type { SsoTokenResponse } from './useAuthFetchData'

export function useAuthFetchMulti() {
    const userStore = useUserStore()
    const runtimeConfig = useRuntimeConfig()
    const baseURL = runtimeConfig.public.apiBase

    const resolveHeaders = () => ({
        ...(userStore.user.access_token
            ? { Authorization: `Bearer ${userStore.user.access_token}` }
            : {})
    })

    const tryRefresh = async (): Promise<boolean> => {
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
                if (resp.refresh_token) userStore.renewRefreshToken(resp)
                return true
            }
            return false
        } catch {
            return false
        }
    }

    const execute = async <T = any>(
        url: string,
        opts?: Parameters<typeof $fetch<T>>[1]
    ): Promise<T> => {
        const makeRequest = () => $fetch<T>(url, {
            baseURL,
            ...opts,
            headers: {
                ...(opts?.headers ?? {}),
                ...resolveHeaders()
            }
        }) as Promise<T>

        try {
            return await makeRequest()
        } catch (err: any) {
            const status = err?.status || err?.response?.status

            if (status === 401) {
                const refreshed = await tryRefresh()
                if (refreshed) return await makeRequest()
                userStore.logOut()
                await navigateTo('/admin2/login')
                throw err // navigateTo is async, this prevents returning undefined
            }

            throw err // re-throw so the caller can handle it
        }
    }

    return { execute }
}