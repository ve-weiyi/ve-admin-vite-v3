import http from "@/utils/request"

interface Page {
    id: any
    pageName: any
    pageLabel: any
    pageCover: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createPageApi(data?: object): Promise<IApiResponseData<Page>> {
  return http.request<IApiResponseData<Page>>({
    url: "/api/v1/page",
    method: "post",
    data,
  })
}

/** 改 */
export function updatePageApi(data?: object): Promise<IApiResponseData<Page>> {
  return http.request<IApiResponseData<Page>>({
    url: "/api/v1/page",
    method: "put",
    data,
  })
}

/** 删 */
export function deletePageApi(id: number): Promise<IApiResponseData<Page>> {
  return http.request<IApiResponseData<Page>>({
    url: `/api/v1/page/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findPageApi(id: number): Promise<IApiResponseData<Page>> {
  return http.request<IApiResponseData<Page>>({
    url: `/api/v1/page/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deletePageByIdsApi(ids: number[]): Promise<IApiResponseData<Page>> {
  return http.request<IApiResponseData<Page>>({
    url: "/api/v1/page/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findPageListApi(page?: Page): Promise<IApiResponseData<PageResult<Page>>> {
  return http.request<IApiResponseData<PageResult<Page>>>({
    url: "/api/v1/page/list",
    method: "post",
    data: page,
  })
}
