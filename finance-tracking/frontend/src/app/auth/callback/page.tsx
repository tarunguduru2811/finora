"use client"
import { api } from "@/lib/api";
import { useUserStore } from "@/lib/store";
import {useRouter,useSearchParams} from "next/navigation"
import {useEffect} from "react"

export default function OAuthCallback(){
    const router = useRouter();
    const searchParams  = useSearchParams();
    const token = searchParams.get("token");
    const {setUser} = useUserStore();


    useEffect(()=>{
        const handleOAuthCallback = async () => {
            try{
                const res = await api.get(`/auth/me`,{
                    headers:{Authorization:`Bearer ${token}`}
                })

                
                console.log("USer details from me route",{
                    id:res.data.userDetails.userId,
                    name:res.data.userDetails.name,
                    email:res.data.userDetails.email
                });
                const user =  {
                    id:res.data.userDetails.userId,
                    name:res.data.userDetails.name,
                    email:res.data.userDetails.email
                };
                setUser(user);
                console.log("User ID in callback",useUserStore.getState().user.id);
                router.push("/dashboard");
            }catch(err){
                console.log("Error in Handling OAuth Callback",err);
                 router.push("/login?error=oauth_failed");
            }
        }

        handleOAuthCallback();
    },[token,router,setUser])

    return(
        <div>
            <p>Signing in With Google</p>
        </div>
    )
}