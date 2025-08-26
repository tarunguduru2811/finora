"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const fetchUser = useUserStore((state) => state.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return <>{children}</>;
}
