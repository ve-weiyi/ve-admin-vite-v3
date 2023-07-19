import http from "@/utils/request"

interface PhotoAlbum {
    id: any
    albumName: any
    albumDesc: any
    albumCover: any
    isDelete: any
    status: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createPhotoAlbumApi(data?: object): Promise<IApiResponseData<PhotoAlbum>> {
  return http.request<IApiResponseData<PhotoAlbum>>({
    url: "/api/v1/photo_album",
    method: "post",
    data,
  })
}

/** 改 */
export function updatePhotoAlbumApi(data?: object): Promise<IApiResponseData<PhotoAlbum>> {
  return http.request<IApiResponseData<PhotoAlbum>>({
    url: "/api/v1/photo_album",
    method: "put",
    data,
  })
}

/** 删 */
export function deletePhotoAlbumApi(id: number): Promise<IApiResponseData<PhotoAlbum>> {
  return http.request<IApiResponseData<PhotoAlbum>>({
    url: `/api/v1/photo_album/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findPhotoAlbumApi(id: number): Promise<IApiResponseData<PhotoAlbum>> {
  return http.request<IApiResponseData<PhotoAlbum>>({
    url: `/api/v1/photo_album/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deletePhotoAlbumByIdsApi(ids: number[]): Promise<IApiResponseData<PhotoAlbum>> {
  return http.request<IApiResponseData<PhotoAlbum>>({
    url: "/api/v1/photo_album/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findPhotoAlbumListApi(page?: Page): Promise<IApiResponseData<PageResult<PhotoAlbum>>> {
  return http.request<IApiResponseData<PageResult<PhotoAlbum>>>({
    url: "/api/v1/photo_album/list",
    method: "post",
    data: page,
  })
}
