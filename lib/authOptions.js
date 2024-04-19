import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { compare } from "bcrypt";
import db from "./db";
// import { UserRole } from "@prisma/client";
export const authOptions = {
  adapter: PrismaAdapter(db), //to get all the details from the db
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "mehretu@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorize function recieved credentials:", credentials);
          // Check if user credentials are they are Not empty
          if (!credentials?.email || !credentials?.password) {
            throw { error: "No Inputs Found", status: 401 };
          }
          console.log("Passed Check 1 ");
          //Check if user exists
          const existingUser = await db.user.findUnique({
            where: {
               email: credentials.email 
              },
              include:{
                company:true
              },
          });
          if (!existingUser) {
            console.log("No user found");
            throw { error: "No user found", status: 401 };
          }

          console.log("Passed Check 2");

          //Check if Password is correct  and compare comes from bcrypt used to check if the plain password and the hashed match
          const passwordMatch = await compare(
            credentials.password,
            existingUser.hashedPassword
          );
          if (!passwordMatch) {
            console.log("Password incorrect");
            throw { error: "Password Incorrect", status: 401 };
          }
          console.log("Pass 3 Checked");
          const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            image: existingUser.image,
            emailVerified: existingUser.emailVerified,
            companyId: existingUser.company?.id,
          };//the user data returned here will be used in the jwt
          //
          console.log("User Compiled");
          // console.log(user);
          return user; //the user data returned here will be used in the jwt
        } catch (error) {
          console.log("ALL Failed");
          console.log(error);
          throw { error: "Something went wrong", status: 401 };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        console.log(`token:${token} in session`);
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.emailVerified = token.emailVerified;
        session.user.companyId = token.companyId;
      }
      console.log(`session:${session.user}`);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
        token.emailVerified = user.emailVerified;
        token.companyId = user.companyId;
      }
      console.log(`token:${token}`);
      return token;
    },
  },
};