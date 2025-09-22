"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store"; 

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean; 
}

const Protected: React.FC<ProtectedProps> = ({ children, authentication = true }) => {
  const router = useRouter();
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    
    if (authentication && authStatus !== authentication) {
      router.push("/login");
    }
    
    else if (!authentication && authStatus !== authentication) {
      router.push("/");
    }
    setLoader(false);
  }, [authStatus, authentication, router]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
};

export default Protected;
