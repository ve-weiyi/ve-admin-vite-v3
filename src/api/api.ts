import http from "@/utils/request"

interface Api {
    id: any
    name: any
    path: any
    method: any
    group: any
    parentId: any
    accessType: any
    status: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createApiApi(data?: object): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: "/api/v1/api",
    method: "post",
    data,
  })
}

/** 改 */
export function updateApiApi(data?: object): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: "/api/v1/api",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteApiApi(id: number): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: `/api/v1/api/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findApiApi(id: number): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: `/api/v1/api/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteApiByIdsApi(ids: number[]): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: "/api/v1/api/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findApiListApi(page?: Page): Promise<IApiResponseData<PageResult<Api>>> {
  return http.request<IApiResponseData<PageResult<Api>>>({
    url: "/api/v1/api/list",
    method: "post",
    data: page,
  })
}

/** 查 列表*/
export function getResourceTreeApi(): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api//v1/admin/apis",
    method: "post",
    data: {},
  })
}
