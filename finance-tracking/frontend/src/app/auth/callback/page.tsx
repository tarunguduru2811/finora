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
            localStorage.setItem("token",JSON.stringify(t));
            setToken(t);
        }, []);

  useEffect(() => {
  if (!token) return; // 🚨 IMPORTANT

  const handleOAuthCallback = async () => {
    try {
      const res = await api.get("/auth/me");

      const user = {
        id: res.data.userDetails.userId,
        name: res.data.userDetails.name,
        email: res.data.userDetails.email,
      };

      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error in OAuth callback", err);
      router.push("/login?error=oauth_failed");
    }
  };

  handleOAuthCallback();
}, [token]);

    return(
        <div>
            <p>Signing in With Google</p>
        </div>
    )
}
