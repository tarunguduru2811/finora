import {create} from "zustand"
import { api } from "./api";

interface UserState{
    user:{id:number,email:String} | null;
    setUser:(user:{id:number,email:String}| null) => void;
}


interface AccountState {
    accounts:any [],
    fetchAccounts : () => Promise<void>,
    addAccount : (name:String,currency:String) => Promise<void>
}

export const useUserStore = create<UserState>((set)=>({
    user:null,
    setUser:(user)=>set({user})
}))

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