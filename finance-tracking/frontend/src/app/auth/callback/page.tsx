"use client"
import { api } from "@/lib/api";
import { useUserStore } from "@/lib/store";
import {useRouter,useSearchParams} from "next/navigation"
import {useEffect, useState} from "react"

export default function OAuthCallback(){
    const router = useRouter();
    // const searchParams  = useSearchParams();
    // const token = searchParams.get("token");
    const [token,setToken] = useState<string | null>(null)
    const {setUser} = useUserStore();

      // Grab token from URL manually in client
        useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const t = params.get("token");
            setToken(t);
        }, []);

    useEffect(()=>{
        const handleOAuthCallback = async () => {
            try{
                const res = await api.get(`/api/auth/me`,{
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
                console.log("User ID in callback",useUserStore.getState().user?.id);
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
