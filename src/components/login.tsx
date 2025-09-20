"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {Button, Input, Logo} from "./index"

const Login: React.FC = () => {
  const router = useRouter();
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ phoneNo, password });
    router.push("/home"); 
  };

  return (
    <div className="flex items-center justify-center w-full mt-28">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl text-black">
        <h2 className="text-3xl font-bold">Welcome Back!</h2>
        <p className="mb-4">Enter your credentials to access your dashboard</p>

        <h6 className="font-bold">Phone Number</h6>
        <Input
          type="number"
          placeholder="Number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          className="w-full mb-4 p-2 rounded"
        />

        <h6 className="font-bold">Password</h6>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded"
        />

        <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Sign in
        </Button>

        <p className="mt-2 text-center">
          Don’t have an account? <Link href="/signup" className="text-blue-700 font-bold">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
