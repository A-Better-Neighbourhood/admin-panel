import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query, Models } from "appwrite";

export interface Post extends Models.Document {
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  featuredMap?: string;
  status: "active" | "inactive";
  userId: string;
  location?: { lat: number; lng: number };
}

export interface PostInput {
  title: string;
  slug: string;
  content: string;
  status: "active" | "inactive";
  featuredImage?: string;
  userId: string;
  location?: { lat: number; lng: number };
}

export class Service {
  private client: Client;
  private databases: Databases;
  private bucket: Storage;

  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost(post: PostInput): Promise<Post | undefined> {
    try {
      return await this.databases.createDocument<Post>(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        post
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(
    slug: string,
    data: Partial<Omit<Post, "slug" | "userId">>
  ): Promise<Post | undefined> {
    try {
      return await this.databases.updateDocument<Post>(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        data
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug: string): Promise<boolean> {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug: string): Promise<Post | false> {
    try {
      return await this.databases.getDocument<Post>(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(
    queries: string[] = [Query.equal("status", "active")]
  ): Promise<Models.DocumentList<Post> | false> {
    try {
      return await this.databases.listDocuments<Post>(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  // File upload service
  async uploadFile(file: File): Promise<Models.File | false> {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId: string): string {
  return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }

}

const service = new Service();
export default service;
