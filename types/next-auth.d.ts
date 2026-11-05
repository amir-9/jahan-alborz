declare module "next-auth" {
  interface User {
    id?: string;
    phone?: string;
    email?: string | null;
    role?: string;
  }

  interface Session {
    user?: User;
  }

  interface JWT {
    id?: string;
    phone?: string;
    role?: string;
  }
}
