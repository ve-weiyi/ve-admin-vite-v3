import http from "@/utils/request"

interface Menu {
    id: any
    name: any
    path: any
    component: any
    icon: any
    rank: any
    parentId: any
    isHidden: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createMenuApi(data?: object): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: "/api/v1/menu",
    method: "post",
    data,
  })
}

/** 改 */
export function updateMenuApi(data?: object): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: "/api/v1/menu",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteMenuApi(id: number): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: `/api/v1/menu/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findMenuApi(id: number): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: `/api/v1/menu/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteMenuByIdsApi(ids: number[]): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: "/api/v1/menu/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findMenuListApi(page?: Page): Promise<IApiResponseData<PageResult<Menu>>> {
  return http.request<IApiResponseData<PageResult<Menu>>>({
    url: "/api/v1/menu/list",
    method: "post",
    data: page,
  })
}

/** 查 列表*/
export function getMenuTreeApi(): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api/v1/admin/menus",
    method: "post",
    data: {},
  })
}
