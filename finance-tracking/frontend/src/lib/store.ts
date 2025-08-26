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
    addAccount : (name:String,currency:String) => Promise<void>
}

export const useUserStore = create<UserState>((set)=>(
        {
            user:null,
            token:null,
            setUser:(user)=>set({user}),
            login: async (email, password) => {
                const res = await api.post("/auth/login", { email, password });
                const { user ,token} = res.data; // assuming your API sends { user, token }
                set({ user ,token});
                localStorage.setItem("token",token)
              },
              fetchUser: async () => {
                try {
                  const res = await api.get("/auth/me");
                  set({ user: res.data.user });
                  localStorage.setItem("token",res.data.token)
                } catch {
                  set({ user: null, token: null });
                }
            },
        }
))

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