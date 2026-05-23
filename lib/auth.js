// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./mongodb";
import User from "../models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();

          // Find user and explicitly select password (it has select: false)
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).select("+password");

          if (!user) {
            throw new Error("No account found with this email");
          }

          if (!user.isActive) {
            throw new Error("This account has been deactivated");
          }

          const isPasswordValid = await user.comparePassword(
            credentials.password,
          );

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          // Update last login timestamp
          await User.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
          });

          // Return the user object — this gets encoded into the JWT
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          };
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    // Called when a JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },

    // Called whenever session is checked — exposes data to the client
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // redirect here when login needed
    error: "/login", // redirect here on auth errors
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};
