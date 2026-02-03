import { defineStore } from "pinia";
import pinia from "@/store";
import { userLogin } from "@/api/User";
import { refreshUserInfo } from "@/api/User";
// export interface IUserState {
//   username: string;
//   accsessToken: string;
//   refreshToken?: string;
//   roles: string[]; //Array<string>
// }

export const useUserStoreHook = defineStore(
  // 唯一ID
  "userInfo",
  {
    state: () => ({
      username: "大伟",
      accessToken: "",
      roles: ["common"],
    }),
    getters: {},
    actions: {
      storeUserLogin(data) {
        return userLogin(data).then((res) => {
          this.username = res.username;
          this.roles = res.roles;
          this.accessToken = res.accessToken;
          return res;
        });
      },
      // 刷新用户信息
      storeRefreshUserInfo() {
        if (this.username == "大伟" && this.accessToken != "") {
          refreshUserInfo({
            accessToken: this.accessToken,
          })
            .then((res) => {
              this.username = res.username;
              this.roles = res.roles;
              this.accessToken = res.accessToken;
            })
            .catch(() => {
              this.accessToken = "";
            });
        }
      },
    },
    // 持久化保存 accessToken
    persist: {
      key: "userInfo",
      storage: sessionStorage,
      paths: ["accessToken"],
    },
  },
);
// 导出该Store
export function useUserStore() {
  return useUserStoreHook(pinia);
}
