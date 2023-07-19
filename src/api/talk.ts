import http from "@/utils/request"

interface Talk {
    id: any
    userId: any
    content: any
    images: any
    isTop: any
    status: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createTalkApi(data?: object): Promise<IApiResponseData<Talk>> {
  return http.request<IApiResponseData<Talk>>({
    url: "/api/v1/talk",
    method: "post",
    data,
  })
}

/** 改 */
export function updateTalkApi(data?: object): Promise<IApiResponseData<Talk>> {
  return http.request<IApiResponseData<Talk>>({
    url: "/api/v1/talk",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteTalkApi(id: number): Promise<IApiResponseData<Talk>> {
  return http.request<IApiResponseData<Talk>>({
    url: `/api/v1/talk/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findTalkApi(id: number): Promise<IApiResponseData<Talk>> {
  return http.request<IApiResponseData<Talk>>({
    url: `/api/v1/talk/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteTalkByIdsApi(ids: number[]): Promise<IApiResponseData<Talk>> {
  return http.request<IApiResponseData<Talk>>({
    url: "/api/v1/talk/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findTalkListApi(page?: Page): Promise<IApiResponseData<PageResult<Talk>>> {
  return http.request<IApiResponseData<PageResult<Talk>>>({
    url: "/api/v1/talk/list",
    method: "post",
    data: page,
  })
}
