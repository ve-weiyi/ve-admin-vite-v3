import http from '@/utils/request'

/** 获取api列表 */
export function adminApisApi(page?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/apis',
    method: 'post',
    data: page,
  })
}

/** 获取菜单列表 */
export function MenusApi(page?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/menus',
    method: 'post',
    data: page,
  })
}

/** 更新角色资源 */
export function adminRoleUpdateResourcesApi(data?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/role/update_resources',
    method: 'post',
    data: data,
  })
}

/** 获取角色列表 */
export function adminRolesApi(page?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/roles',
    method: 'post',
    data: page,
  })
}

/** 修改用户角色 */
export function adminUpdateRolesApi(data?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/update_roles',
    method: 'post',
    data: data,
  })
}

/** 修改用户状态 */
export function adminUpdateStatusApi(data?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/update_status',
    method: 'post',
    data: data,
  })
}

/** 获取用户列表 */
export function adminUsersApi(page?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/users',
    method: 'post',
    data: page,
  })
}

/** 获取用户地区 */
export function adminUserAreasApi(page?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/user/areas',
    method: 'post',
    data: page,
  })
}

/** 获取博客后台信息 */
export function adminHomeInfoApi(): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: '/api/v1/admin/home',
    method: 'get',
  })
}
