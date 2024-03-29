import db from "@/lib/db"
import { hash } from "bcrypt";
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';
import base64url from 'base64url';
import { Resend } from "resend";

export async function POST(request){
    try{
        const {name, email,password,role} = await request.json()
        
        //Check if user email already exists
        const userExist = await db.user.findUnique({
            where: {email},
        })
        if(userExist){
            return NextResponse.json(
                {
                    message: "User Already exists",
                    user:null,
                },
                {status:409}
            );
        }
        const hashedPassword = await hash(password,10)
        //Generate Token
        //Generate a random UUID (version 4)
        const rawToken = uuidv4()

        //Encode the token using Base64 URL-safe format
        const token = base64url.encode(rawToken)
        
        //create user in the db
        // const newUser = await db.user.create({
        //     data:{
        //         name,
        //         email,
        //         password,
        //         hashedPassword,
        //         role,
                //    verificationToken:token,
        //     },
        // });

        // Send an email with token on the link as a search param



        // resend.emails.send({
        // from: 'onboarding@resend.dev',
        // to: 'mehertuabreham@gmail.com',
        // subject: 'Hello World',
        // html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        // });

        //Upon Click redirect them to the login 
        console.log(token)
        return NextResponse.json(
            {
            data:null,  //newUser
            message:"User created successfully"
            },
            {status:201}
        );

        }catch(error){
        console.log(error)
        return NextResponse.json(
            {
                error,
                message: "Server error: Something went wrong",
            },
            {status:500})
    }
}

export async function GET(request){
    try {
        const users = await db.user.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                company:true,
            }
        });
        return NextResponse.json(users)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch users"
        },{
            status:500
        })
        
    }
}