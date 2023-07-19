import http from "@/utils/request"

interface Role {
    id: any
    rolePid: any
    roleDomain: any
    roleName: any
    roleComment: any
    isDisable: any
    isDefault: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createRoleApi(data?: object): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: "/api/v1/role",
    method: "post",
    data,
  })
}

/** 改 */
export function updateRoleApi(data?: object): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: "/api/v1/role",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteRoleApi(id: number): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: `/api/v1/role/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findRoleApi(id: number): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: `/api/v1/role/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteRoleByIdsApi(ids: number[]): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: "/api/v1/role/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findRoleListApi(page?: Page): Promise<IApiResponseData<PageResult<Role>>> {
  return http.request<IApiResponseData<PageResult<Role>>>({
    url: "/api/v1/role/list",
    method: "post",
    data: page,
  })
}

/** 查 列表*/
export function getRoleTreeApi(): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api/v1/admin/roles",
    method: "post",
    data: {},
  })
}

/** 改 */
export function updateRoleMenusApi(data: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api/v1/admin/role/update_menus",
    method: "post",
    data,
  })
}

/** 改 */
export function updateRoleResourcesApi(data: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api/v1/admin/role/update_resources",
    method: "post",
    data,
  })
}
