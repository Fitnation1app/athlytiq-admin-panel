"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

  return isChecking;
}