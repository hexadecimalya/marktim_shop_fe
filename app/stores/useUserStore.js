import { defineStore } from 'pinia'
import { useCookie } from "#app";
const cookieOpts = { path: '/', sameSite: 'lax', secure: true }

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
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
  }),

  actions: {
    initStore() {
      Object.keys(this.user).forEach((key) => {
        let param = useCookie(key);
        if (key !== 'redirect_to' && param.value){
          this.user[key] = param.value;
        }
      });
    },

    logOut() {
      try {
        Object.keys(this.user).forEach((key) => {
          this.user[key] = null
          useCookie(key, cookieOpts).value = null
        })
      } catch (error) {}
    },

    renewAccessToken(token) {
      const tokenStr = token?.access_token || token;
      this.user.access_token = tokenStr;
      useCookie('access_token', cookieOpts).value = tokenStr;
    },

    renewRefreshToken(token) {
      const tokenStr = token?.refresh_token || token;
      this.user.refresh_token = tokenStr;
      useCookie('refresh_token', cookieOpts).value = tokenStr;

    },
    
    setProperty(property, value){
      this.user[property] = value;
      useCookie(property, cookieOpts).value = value || '';
    },

    initUserDataFromObject(data) {
      Object.keys(data).forEach((key) => {
        if (key in this.user) {
          this.user[key] = data[key]
          useCookie(key, cookieOpts).value = data[key];
        }
      })
    }
  }
})