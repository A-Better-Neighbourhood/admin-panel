// import conf from '../conf/conf';
// import { Client, Account, ID , Models } from "appwrite";

// export class AuthService {
//     private client: Client;
//     private account: Account;

//     constructor() {
//         this.client = new Client()
//             .setEndpoint(conf.appwriteUrl)
//             .setProject(conf.appwriteProjectId);

//         this.account = new Account(this.client);
//     }

//     async createAccount({
//         name,
//         phoneNo,
//         password
//     }: {
//         name: string;
//         phoneNo: string;
//         password: string;
//     }): Promise<Models.Session | Models.User<Models.Preferences> | null> {
//         try {
//             const userAccount = await this.account.create(
//                 ID.unique(),
//                 name,
//                 phoneNo,
//                 password
//             );

//             if (userAccount) {
//                 // after creating user, log them in
//                 return await this.login({ phoneNo, password });
//             } else {
//                 return userAccount;
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async login({
//         phoneNo,
//         password,
//     }: {
//         phoneNo: string;
//         password: string;
//     }): Promise<Models.Session> {
//         try {
//             return await this.account.createEmailPasswordSession(phoneNo, password);
//         } catch (error) {
//             throw error;
//         }
//     }

//     async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
//         try {
//             return await this.account.get();
//         } catch (error) {
//             console.log("Appwrite service :: getCurrentUser :: error", error);
//         }
//         return null;
//     }

//     async logout(): Promise<void> {
//         try {
//             await this.account.deleteSessions();
//         } catch (error) {
//             console.log("Appwrite service :: logout :: error", error);
//         }
//     }
// }

// const authService = new AuthService();

// export default authService;


import conf from "../conf/conf";
import { Client, Account, ID, Models } from "appwrite";

export class AuthService {
  private client: Client;
  private account: Account;

  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

//   /**
//    * Create a new account using phone number
//    * @param phoneNo - user's phone number
//    * @param password - user's password
//    * @param name - full name
//    * @returns logged in session or user object
//    */

  async createAccount({
    phoneNo,
    password,
    name,
  }: {
    phoneNo: number;
    password: string;
    name: string;
  }): Promise<Models.Session | Models.User<Models.Preferences> | null> {
    try {
      const phoneStr = phoneNo.toString();
      const emailPlaceholder = `${phoneStr}@appwrite.local`; // required by Appwrite

      // Create Appwrite user
      const userAccount = await this.account.create(
        ID.unique(),
        emailPlaceholder,
        password,
        name
      );

      if (userAccount) {
        // Automatically log in the user after creation
        return await this.login({ phoneNo, password });
      }

      return userAccount;
    } catch (error) {
      console.error("AuthService :: createAccount :: error", error);
      throw error;
    }
  }

  /**
   * Login user using phone number
   */
  async login({
    phoneNo,
    password,
  }: {
    phoneNo: number;
    password: string;
  }): Promise<Models.Session> {
    try {
      const emailPlaceholder = `${phoneNo.toString()}@appwrite.local`;
      return await this.account.createEmailPasswordSession(
        emailPlaceholder,
        password
      );
    } catch (error) {
      console.error("AuthService :: login :: error", error);
      throw error;
    }
  }

  /**
   * Get current logged-in user
   */
  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("AuthService :: getCurrentUser :: error", error);
      return null;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("AuthService :: logout :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
