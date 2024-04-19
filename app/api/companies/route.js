import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const data =await request.json();
   

    if(!user){
        throw new Error("User not found")
    }
    console.log("Company Data",data)
    const company = await db.company.create({
        data:{
            title:data.title,
            ownerName:data.ownerName,
            tinNumber:data.tinNumber,
            fax:data.fax,
            email:data.email,
            phone:data.phone,
            address:data.address,

            
        },
    });
    const user = await db.user.findUnique({
        where:{
            id: data.userId
        },
        
    })
    const updatedUser = await db.user.update({
        where: {
            id: user.id
        },
        data: {
            companyId: company.id
        }
    });
    console.log(updatedUser);
    return NextResponse.json(company)
}catch(error){
    console.log(error)
    return NextResponse.json({
        error,
        message:"Failed to create a company"
    },{
        status:500
    })
}    
}


export async function GET(request){
    try {
        const companies = await db.company.findMany({
            orderBy:{
                createdAt:'desc'
            },
        });
        return NextResponse.json(companies)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch companies"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedCompany = await db.company.delete({
            where:{
                id
            },
        })
        console.log(deletedCompany)
        return NextResponse.json(deletedCompany)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete Company",
        },{
            status:500
        })
        
    }
}