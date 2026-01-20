import {create} from "zustand"
import {persist} from "zustand/middleware"
import { api } from "./api";

interface User{
    id:number,
    name:string,
    email:string
}
interface UserState{
    user:User | null,
    token:string | null,
    setUser:(user:User | null)=> void
    login:(email:string,password:string)=>Promise<void>
    // logout:()=>void
    fetchUser:()=>Promise<void>
}


interface AccountState {
    accounts:any [],
    fetchAccounts : () => Promise<void>,
    addAccount : (name:string,currency:string) => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      login: async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const { user, token } = res.data;
        set({ user, token });
        localStorage.setItem("token", token);
      },
      fetchUser: async () => {
        try {
          const res = await api.get("/auth/me");
          set({ user: res.data.user });
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: "user-storage", // key in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }), // only store what you need
    }
  )
);


export const useAccountStore = create<AccountState>((set)=>({
    accounts:[],
    fetchAccounts: async () => {
        const res =  await api.get("/accounts");
        set({accounts:res.data})
    },
    addAccount: async (name,currency) => {
        await api.post("/accounts",{name,currency});
        const res = await api.get("/accounts")
        set({accounts:res.data})
    }
}))