import {create} from "zustand"
import {persist} from "zustand/middleware"
import { api } from "./api";

interface User{
    id:number,
    email:string
}
interface UserState{
    user:User | null,
    token:string | null,
    setUser:(user:User | null)=> void
    login:(email:string,password:string)=>Promise<void>
    // logout:()=>void
}


interface AccountState {
    accounts:any [],
    fetchAccounts : () => Promise<void>,
    addAccount : (name:String,currency:String) => Promise<void>
}

export const useUserStore = create<UserState>()(
    persist((set)=>(
        {
            user:null,
            token:null,
            setUser:(user)=>set({user}),
            login: async (email, password) => {
                const res = await api.post("/auth/login", { email, password });
                const { user ,token} = res.data; // assuming your API sends { user, token }
                set({ user });
                localStorage.setItem("token",token)
              },
            // logout:()=>set({user:null,token:null}) TODO : On Doing Refresh Again Asking to Login
        }
    ),{name:"auth-storage"})
)
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