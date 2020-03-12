import { router } from 'umi';
import { stringify } from 'qs';
import { login, logout } from '@/services/login';

import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setAuthority } from '@/utils/authority';

const Model = {
  namespace: 'login',

  state: {
    status: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      // 判断请求成功的方法有很多，请结合后台接口判断。
      // 比如，后台数据统一封装成{code:200, message:'OK', data:Object|Array }，那你的判断就是response.code===200;
      // 当然，也有的后台接口，数据直接返回无封装，像这样{token:token,resources:['a','b']]，但请求失败是统一的格式，就可以使用请求失败的格式进行判断。
      // 在这里，我的接口，请求成功时直接返回一堆数据；请求失败时统一封装错误信息返回。
      if (response.status !== 'error') {
        const { token, resources } = response;
        localStorage.setItem('jwt', token);
        reloadAuthorized(resources);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    *logout(_, { call }) {
      yield call(logout);
      reloadAuthorized();
      localStorage.clear();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.resources || []);
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
