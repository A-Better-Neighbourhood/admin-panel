"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "./index";

const Signup: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await createAccount({ name, phoneNo, password });
      console.log("User created:", user);

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     console.log({ name, phoneNo, password });
  //     router.push("/signup"); // redirect
  //   };

  return (
    <div className="flex items-center justify-center w-full mt-28">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl text-black w-100">
        <h2 className="text-3xl font-bold">Create an Account!</h2>
        <p className="mb-4">Sign up to get started with your dashboard</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <h6 className="font-bold">Full Name</h6>
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 rounded"
        />

        <h6 className="font-bold">Phone Number</h6>
        <Input
          type="number"
          placeholder="Phone Number"
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
          Sign Up
        </Button>

        <p className="mt-2 text-center">
          Already have an account?{" "}
          <Link href="/" className="text-blue-700 font-bold">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

async function createAccount(data: { name: string; phoneNo: string; password: string }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data.name || !data.phoneNo || !data.password) {
        reject(new Error("All fields are required"));
      } else {
        resolve(data);
      }
    }, 500);
  });
}

export default Signup;
