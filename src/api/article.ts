import http from "@/utils/request"

interface Article {
    id: any
    userId: any
    categoryId: any
    articleCover: any
    articleTitle: any
    articleContent: any
    type: any
    originalUrl: any
    isTop: any
    isDelete: any
    status: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createArticleApi(data?: object): Promise<IApiResponseData<Article>> {
  return http.request<IApiResponseData<Article>>({
    url: "/api/v1/article",
    method: "post",
    data,
  })
}

/** 改 */
export function updateArticleApi(data?: object): Promise<IApiResponseData<Article>> {
  return http.request<IApiResponseData<Article>>({
    url: "/api/v1/article",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteArticleApi(id: number): Promise<IApiResponseData<Article>> {
  return http.request<IApiResponseData<Article>>({
    url: `/api/v1/article/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findArticleApi(id: number): Promise<IApiResponseData<Article>> {
  return http.request<IApiResponseData<Article>>({
    url: `/api/v1/article/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteArticleByIdsApi(ids: number[]): Promise<IApiResponseData<Article>> {
  return http.request<IApiResponseData<Article>>({
    url: "/api/v1/article/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findArticleListApi(page?: Page): Promise<IApiResponseData<PageResult<Article>>> {
  return http.request<IApiResponseData<PageResult<Article>>>({
    url: "/api/v1/article/list",
    method: "post",
    data: page,
  })
}

/** 查 列表*/
export function getArticleListByConditionApi(data?: object): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api/v1/article/condition",
    method: "post",
    data: data,
  })
}

/** 查 列表*/
export function getArticleArchivesApi(page?: Page): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: "/api/v1/article/archives",
    method: "get",
    data: page,
  })
}
