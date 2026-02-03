import { post } from "@/http/request";
// 导入类型
// import { LoginRequest, LoginResponse, reLoginRequest } from "@/api/user/types";
// 登录所需的参数
export type LoginRequest = {
  username: string;
  password: string;
};

// 刷新登录信息需要的参数
export type reLoginRequest = {
  accessToken: string;
};

// 登录后返回的响应信息
export type LoginResponse = {
  username: string;
  roles: Array<string>;
  accessToken: string;
};
// post 请求直接传入一个 data 即可 url 我们直接在此处封装好
// 需要更改时也只需在此处更改
export const userLogin = async (data?: LoginRequest) => {
  return post<LoginResponse>({}, "/login", data);
};

export const refreshUserInfo = async (data?: reLoginRequest) => {
  return post<LoginResponse>({}, "/getUserInfo", data);
};
