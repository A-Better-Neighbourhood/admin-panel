"use client";

import React, { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Select } from "..";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import CameraCaptureWithLocation from "../captureCamera";



// Local Post and PostInput types
export interface Post {
  $id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  featuredImage?: string;
  userId: string;
  location?: { lat: number; lng: number };
  road?: string;
  upvotes?: number;
}
export interface PostInput {
  title: string;
  slug: string;
  content: string;
  status: string;
  featuredImage?: string;
  userId: string;
  location?: { lat: number; lng: number };
  road?: string;
  upvotes?: number;
}

interface PostFormProps {
  post?: Post;
}

interface FormValues {
  title: string;
  slug: string;
  content: string;
  status: string;
  image?: string;
  location?: { lat: number; lng: number };
}

// ✅ Convert base64 → File
const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

const PostForm: React.FC<PostFormProps> = ({ post }) => {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.auth.userData);

  const { register, handleSubmit, watch, setValue, control } = useForm<FormValues>({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
      location: post?.location || undefined,
    },
  });

  // ✅ Generate slug from title
  const slugTransform = useCallback((value: string) => {
    if (value)
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title || ""), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data: FormValues) => {
    if (!userData) {
      alert("Please login first.");
      return;
    }


    let fileId: string | undefined;
    if (data.image) {
      // For local: just use the base64 string as the image
      fileId = data.image;
    }


    const payload: PostInput = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      status: data.status,
      featuredImage: fileId || post?.featuredImage || undefined,
      userId: userData.$id,
      location: data.location,
    };

    try {
      if (post) {
        // Local update: just log and redirect
        const updatedPost = { ...post, ...payload };
        router.push(`/post/${updatedPost.$id}`);
      } else {
        // Local create: generate a fake id and redirect
        const newPost = { $id: Date.now().toString(), ...payload };
        router.push(`/post/${newPost.$id}`);
      }
    } catch (err) {
      console.error("Error creating/updating post:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-full max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row gap-8 border border-gray-200 backdrop-blur-lg"
    >
      {/* Left side */}
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2 tracking-tight">
          {post ? "Edit Report" : "Create a New Report"}
        </h2>
        <Input
          label="Title"
          placeholder="Enter a catchy title..."
          className="mb-2"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug"
          placeholder="Auto-generated from title"
          className="mb-2"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
          }
        />
        <div className="mb-2">
          <label className="block mb-1 font-semibold text-gray-700">Content</label>
          <textarea
            {...register("content", { required: true })}
            placeholder="Describe your report in detail..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 shadow-sm transition"
            rows={8}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-80 flex flex-col gap-6 items-center">
        <div className="w-full">
          <Controller
            name="image"
            control={control}
            rules={{ required: !post }}
            render={({ field }) => (
              <CameraCaptureWithLocation
                onCapture={(img, loc) => {
                  field.onChange(img);
                  setValue("location", loc);
                }}
              />
            )}
          />
        </div>

        {post?.featuredImage && (
          <div className="w-full mb-2 flex flex-col items-center">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="rounded-xl shadow-lg border border-gray-200 max-h-48 object-cover"
            />
            <span className="text-xs text-gray-500 mt-1">Current Image</span>
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-2"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
          className="w-full py-3 text-lg font-semibold shadow-md transition"
        >
          {post ? "Update Report" : "Submit Report"}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
