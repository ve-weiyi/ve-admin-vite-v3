import http from "@/utils/request"

interface FriendLink {
    id: any
    linkName: any
    linkAvatar: any
    linkAddress: any
    linkIntro: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createFriendLinkApi(data?: object): Promise<IApiResponseData<FriendLink>> {
  return http.request<IApiResponseData<FriendLink>>({
    url: "/api/v1/friend_link",
    method: "post",
    data,
  })
}

/** 改 */
export function updateFriendLinkApi(data?: object): Promise<IApiResponseData<FriendLink>> {
  return http.request<IApiResponseData<FriendLink>>({
    url: "/api/v1/friend_link",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteFriendLinkApi(id: number): Promise<IApiResponseData<FriendLink>> {
  return http.request<IApiResponseData<FriendLink>>({
    url: `/api/v1/friend_link/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findFriendLinkApi(id: number): Promise<IApiResponseData<FriendLink>> {
  return http.request<IApiResponseData<FriendLink>>({
    url: `/api/v1/friend_link/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteFriendLinkByIdsApi(ids: number[]): Promise<IApiResponseData<FriendLink>> {
  return http.request<IApiResponseData<FriendLink>>({
    url: "/api/v1/friend_link/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findFriendLinkListApi(page?: Page): Promise<IApiResponseData<PageResult<FriendLink>>> {
  return http.request<IApiResponseData<PageResult<FriendLink>>>({
    url: "/api/v1/friend_link/list",
    method: "post",
    data: page,
  })
}
