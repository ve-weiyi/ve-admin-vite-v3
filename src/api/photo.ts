import http from "@/utils/request"

interface Photo {
    id: any
    albumId: any
    photoName: any
    photoDesc: any
    photoSrc: any
    isDelete: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createPhotoApi(data?: object): Promise<IApiResponseData<Photo>> {
  return http.request<IApiResponseData<Photo>>({
    url: "/api/v1/photo",
    method: "post",
    data,
  })
}

/** 改 */
export function updatePhotoApi(data?: object): Promise<IApiResponseData<Photo>> {
  return http.request<IApiResponseData<Photo>>({
    url: "/api/v1/photo",
    method: "put",
    data,
  })
}

/** 删 */
export function deletePhotoApi(id: number): Promise<IApiResponseData<Photo>> {
  return http.request<IApiResponseData<Photo>>({
    url: `/api/v1/photo/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findPhotoApi(id: number): Promise<IApiResponseData<Photo>> {
  return http.request<IApiResponseData<Photo>>({
    url: `/api/v1/photo/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deletePhotoByIdsApi(ids: number[]): Promise<IApiResponseData<Photo>> {
  return http.request<IApiResponseData<Photo>>({
    url: "/api/v1/photo/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findPhotoListApi(page?: Page): Promise<IApiResponseData<PageResult<Photo>>> {
  return http.request<IApiResponseData<PageResult<Photo>>>({
    url: "/api/v1/photo/list",
    method: "post",
    data: page,
  })
}
