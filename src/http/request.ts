import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import { getMessageInfo } from "./status";

export interface BaseResponse<T = any> {
  code: number | string;
  message: string;
  data: T;
  status?: number | string;
}

const service = axios.create({
  baseURL: import.meta.env.VUE_APP_BASE_API || "/api",
  timeout: 15000,
});

// axios实例拦截请求
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// axios实例拦截响应
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    }
    ElMessage({
      message: getMessageInfo(response.status),
      type: "error",
    });
    return response.data;
  },
  //请求失败
  (error: any) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      ElMessage({
        message: getMessageInfo(response.status),
        type: "error",
      });
      return Promise.reject(response.data);
    }
    ElMessage({
      message: "网络异常,请稍后再试!",
      type: "error",
    });
  },
);
// BaseResponse 为 res.data 的类型
// T 为 res.data.data 的类型 不同的接口会返回不同的 data 所以我们加一个泛型表示
// 此处相当于二次响应拦截
// 为响应数据进行定制化处理
const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    service
      .request<any, AxiosResponse<BaseResponse>>(conf)
      .then((res: AxiosResponse<BaseResponse>) => {
        const data = res.data;
        // 如果data.code为错误代码返回message信息
        if (data.code != 1) {
          ElMessage({
            message: data.message,
            type: "error",
          });
          reject(data.message);
        } else {
          ElMessage({
            message: data.message,
            type: "success",
          });
          // 此处返回data信息 也就是 api 中配置好的 Response类型
          resolve(data.data as T);
        }
      });
  });
};
// 在最后使用封装过的axios导出不同的请求方式
export function get<T = any, U = any>(
  config: AxiosRequestConfig,
  url: string,
  parms?: U,
): Promise<T> {
  return requestInstance({ ...config, url, method: "GET", params: parms });
}

export function post<T = any, U = any>(
  config: AxiosRequestConfig,
  url: string,
  data: U,
): Promise<T> {
  return requestInstance({ ...config, url, method: "POST", data: data });
}
export function put<T = any, U = any>(
  config: AxiosRequestConfig,
  url: string,
  parms?: U,
): Promise<T> {
  return requestInstance({ ...config, url, method: "PUT", params: parms });
}

export function del<T = any, U = any>(
  config: AxiosRequestConfig,
  url: string,
  data: U,
): Promise<T> {
  return requestInstance({ ...config, url, method: "DELETE", data: data });
}
export default service;
