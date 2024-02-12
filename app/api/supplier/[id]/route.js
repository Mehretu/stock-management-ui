import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const supplier = await db.supplier.findUnique({
            where:{
                id
            },
            // cache:no-store
        });
        return NextResponse.json(supplier)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch supplier"
        },{
            status:500
        })
        
    }
}
export async function PUT(request,{params:{id}}){
    try {
        const itemData = await request.json()
        const supplier = await db.supplier.update({
            where:{
                id
            },
            data:{
                title: itemData.title,
                phone: itemData.phone,
                email: itemData.email,
                address: itemData.address,
                contactPerson: itemData.contactPerson,
                supplierCode: itemData.supplierCode,
                paymentTerms: itemData.paymentTerms,
                taxID: itemData.taxID,
                notes: itemData.notes,
            },
        });
        console.log(supplier)
        return NextResponse.json(supplier)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the supplier"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.supplier.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Supplier with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the supplier with ID ${id}`
        }, {
            status: 500
        });
    }
}