/**
 * 该接口主要是对当前登录用户的操作，与 src/pages/system/user/service.js（对权限范围内的所有用户进行操作）不同。
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取当前登录用户信息。
 * @returns {Promise<void>}
 */
export async function getCurrentUser() {
  return request(`/users/info`);
}

/**
 * 更新当前登录用户信息。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateCurrentUser(params) {
  return request.put(`/users/info`, {
    data: {
      ...params,
    },
  });
}

/**
 * 更新当前登录用户密码。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function updateCurrentUserPassword(params) {
  const { oldPassword, newPassword } = params;
  return request.patch(`/users/info/password`, {
    data: {
      oldPassword,
      newPassword,
    },
  });
}

/**
 * 获取整棵部门树数据。
 * @returns {Promise<void>}
 */
export async function getDepartmentTree(params) {
  return request(`/departments?${stringify(params)}`);
}

/**
 * 按部门查询用户列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function listUser(params) {
  return request(`/users?${stringify(params)}`);
}
