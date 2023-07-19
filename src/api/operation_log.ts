import http from "@/utils/request"

interface OperationLog {
    id: any
    optModule: any
    optType: any
    optUrl: any
    optMethod: any
    optDesc: any
    requestParam: any
    requestMethod: any
    responseData: any
    userId: any
    nickname: any
    ipAddress: any
    ipSource: any
    createdAt: any
    updatedAt: any
}

/** 增 */
export function createOperationLogApi(data?: object): Promise<IApiResponseData<OperationLog>> {
  return http.request<IApiResponseData<OperationLog>>({
    url: "/api/v1/operation_log",
    method: "post",
    data,
  })
}

/** 改 */
export function updateOperationLogApi(data?: object): Promise<IApiResponseData<OperationLog>> {
  return http.request<IApiResponseData<OperationLog>>({
    url: "/api/v1/operation_log",
    method: "put",
    data,
  })
}

/** 删 */
export function deleteOperationLogApi(id: number): Promise<IApiResponseData<OperationLog>> {
  return http.request<IApiResponseData<OperationLog>>({
    url: `/api/v1/operation_log/${id}`,
    method: "delete",
  })
}

/** 查 */
export function findOperationLogApi(id: number): Promise<IApiResponseData<OperationLog>> {
  return http.request<IApiResponseData<OperationLog>>({
    url: `/api/v1/operation_log/${id}`,
    method: "get",
  })
}

/** 删除 批量操作 */
export function deleteOperationLogByIdsApi(ids: number[]): Promise<IApiResponseData<OperationLog>> {
  return http.request<IApiResponseData<OperationLog>>({
    url: "/api/v1/operation_log/batch_delete",
    method: "delete",
    data: ids,
  })
}

/** 查询 分页列表 */
export function findOperationLogListApi(page?: Page): Promise<IApiResponseData<PageResult<OperationLog>>> {
  return http.request<IApiResponseData<PageResult<OperationLog>>>({
    url: "/api/v1/operation_log/list",
    method: "post",
    data: page,
  })
}
