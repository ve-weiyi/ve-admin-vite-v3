import http from "@/utils/request"

interface Tag {
    id: any
    tagName: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createTagApi(data?: object): Promise<IApiResponseData<Tag>> {
  return http.request<IApiResponseData<Tag>>({
    url: "/api/v1/tag",
    method: "post",
    data,
  })
}

/** 改 */
export function updateTagApi(data?: object): Promise<IApiResponseData<Tag>> {
  return http.request<IApiResponseData<Tag>>({
    url: "/api/v1/tag",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteTagApi(id: number): Promise<IApiResponseData<Tag>> {
  return http.request<IApiResponseData<Tag>>({
    url: `/api/v1/tag/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findTagApi(id: number): Promise<IApiResponseData<Tag>> {
  return http.request<IApiResponseData<Tag>>({
    url: `/api/v1/tag/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteTagByIdsApi(ids: number[]): Promise<IApiResponseData<Tag>> {
  return http.request<IApiResponseData<Tag>>({
    url: "/api/v1/tag/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findTagListApi(page?: Page): Promise<IApiResponseData<PageResult<Tag>>> {
  return http.request<IApiResponseData<PageResult<Tag>>>({
    url: "/api/v1/tag/list",
    method: "post",
    data: page,
  })
}
