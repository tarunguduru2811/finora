"use client"
import { api } from "@/lib/api";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback() {
  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true,
        });

        setUser({
          id: res.data.userDetails.userId,
          name: res.data.userDetails.name,
          email: res.data.userDetails.email,
        });

        router.push("/dashboard");
      } catch (err) {
        console.error("OAuth callback error", err);
        router.push("/login?error=oauth_failed");
      }
    };

    fetchMe();
  }, [router, setUser]);

  return <p>Signing in with Google…</p>;
}
