import http from "@/utils/request"

interface Remark {
    id: any
    nickname: any
    avatar: any
    messageContent: any
    ipAddress: any
    ipSource: any
    time: any
    isReview: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createRemarkApi(data?: object): Promise<IApiResponseData<Remark>> {
  return http.request<IApiResponseData<Remark>>({
    url: "/api/v1/remark",
    method: "post",
    data,
  })
}

/** 改 */
export function updateRemarkApi(data?: object): Promise<IApiResponseData<Remark>> {
  return http.request<IApiResponseData<Remark>>({
    url: "/api/v1/remark",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteRemarkApi(id: number): Promise<IApiResponseData<Remark>> {
  return http.request<IApiResponseData<Remark>>({
    url: `/api/v1/remark/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findRemarkApi(id: number): Promise<IApiResponseData<Remark>> {
  return http.request<IApiResponseData<Remark>>({
    url: `/api/v1/remark/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteRemarkByIdsApi(ids: number[]): Promise<IApiResponseData<Remark>> {
  return http.request<IApiResponseData<Remark>>({
    url: "/api/v1/remark/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findRemarkListApi(page?: Page): Promise<IApiResponseData<PageResult<Remark>>> {
  return http.request<IApiResponseData<PageResult<Remark>>>({
    url: "/api/v1/remark/list",
    method: "post",
    data: page,
  })
}
