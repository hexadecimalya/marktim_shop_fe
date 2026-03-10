import { defineStore } from 'pinia'
import { useCookie } from '#app'

const cookieOpts = { path: '/', sameSite: 'lax', secure: true }

const defaultUser = {
    email: '',
    access_token: '',
    refresh_token: '',
    id: null,
    date_joined: null,
    first_name: null,
    last_name: null,
    username: null,
    is_staff: false
}

export const useUserStore = defineStore('user', () => {
    const user = ref({ ...defaultUser })

    const initStore = () => {
        Object.keys(user.value).forEach((key) => {
            const cookie = useCookie(key)
            if (key !== 'redirect_to' && cookie.value) {
                user.value[key] = cookie.value
            }
        })
    }

    const logOut = () => {
        try {
            Object.keys(user.value).forEach((key) => {
                user.value[key] = null
                useCookie(key, cookieOpts).value = null
            })
        } catch (error) {}
    }

    const renewAccessToken = (token) => {
        const tokenStr = token?.access_token || token
        user.value.access_token = tokenStr
        useCookie('access_token', cookieOpts).value = tokenStr
    }

    const renewRefreshToken = (token) => {
        const tokenStr = token?.refresh_token || token
        user.value.refresh_token = tokenStr
        useCookie('refresh_token', cookieOpts).value = tokenStr
    }

    const setProperty = (property, value) => {
        user.value[property] = value
        useCookie(property, cookieOpts).value = value || ''
    }

    const initUserDataFromObject = (data) => {
        Object.keys(data).forEach((key) => {
            if (key in user.value) {
                user.value[key] = data[key]
                useCookie(key, cookieOpts).value = data[key]
            }
        })
    }

    return {
        user,
        initStore,
        logOut,
        renewAccessToken,
        renewRefreshToken,
        setProperty,
        initUserDataFromObject
    }
})