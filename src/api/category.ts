import http from "@/utils/request"

interface Category {
    id: any
    categoryName: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createCategoryApi(data?: object): Promise<IApiResponseData<Category>> {
  return http.request<IApiResponseData<Category>>({
    url: "/api/v1/category",
    method: "post",
    data,
  })
}

/** 改 */
export function updateCategoryApi(data?: object): Promise<IApiResponseData<Category>> {
  return http.request<IApiResponseData<Category>>({
    url: "/api/v1/category",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteCategoryApi(id: number): Promise<IApiResponseData<Category>> {
  return http.request<IApiResponseData<Category>>({
    url: `/api/v1/category/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findCategoryApi(id: number): Promise<IApiResponseData<Category>> {
  return http.request<IApiResponseData<Category>>({
    url: `/api/v1/category/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteCategoryByIdsApi(ids: number[]): Promise<IApiResponseData<Category>> {
  return http.request<IApiResponseData<Category>>({
    url: "/api/v1/category/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findCategoryListApi(page?: Page): Promise<IApiResponseData<PageResult<Category>>> {
  return http.request<IApiResponseData<PageResult<Category>>>({
    url: "/api/v1/category/list",
    method: "post",
    data: page,
  })
}
