import axios from "axios"
import { config } from "process";


export const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    if(typeof window !== "undefined"){
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config;
})

export const recurringRuleApis =  {
    list:()=>api.get("/recurring-rules"),
    create:(data:any)=>api.post("/recurring-rules",data),
    update:(id:number,data:any)=>api.put(`recurring-rules/${id}`,data),
    delete:(id:number)=>api.delete(`/recurring-rules/${id}`),
    toggle:(id:number,data:any)=>api.put(`/recurring-rules/${id}`,data)
}

export const handleOAuth = {
    googleAuth : () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/google`
    },
    gitlabAuth : () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/gitlab`
    },
    twitterAuth:() =>{
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/twitter`
    }

}
export const accountsApi = {
    list:()=>api.get("/accounts")
}

export const categoriesApi = {
    list:()=>api.get("/categories")
}