import http from "@/utils/request"

interface Comment {
    id: any
    userId: any
    topicId: any
    commentContent: any
    replyUserId: any
    parentId: any
    type: any
    isDelete: any
    isReview: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createCommentApi(data?: object): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: "/api/v1/comment",
    method: "post",
    data,
  })
}

/** 改 */
export function updateCommentApi(data?: object): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: "/api/v1/comment",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteCommentApi(id: number): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findCommentApi(id: number): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteCommentByIdsApi(ids: number[]): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: "/api/v1/comment/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findCommentListApi(page?: Page): Promise<IApiResponseData<PageResult<Comment>>> {
  return http.request<IApiResponseData<PageResult<Comment>>>({
    url: "/api/v1/comment/list",
    method: "post",
    data: page,
  })
}

/** 查 列表*/
export function findCommentReplyListApi(id: number, page?: Page): Promise<IApiResponseData<any>> {
  console.log("id", id)
  console.log("page", page)
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/comment/${id}/reply_list`,
    method: "post",
    data: page,
  })
}

export function likeCommentApi(id: number): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/comment/${id}/like`,
    method: "post",
  })
}
