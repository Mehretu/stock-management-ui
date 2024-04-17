import * as XLSX from 'xlsx'; 
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { dateFrom, dateTo } = await request.json();

    const salesOrders = await db.salesOrder.findMany({
      where: {
        createdAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
      include: {
        customer: true,
        itemsOrdered: {
             include:{
              item:true,
             }
        }

      },
    });

    const worksheetData = salesOrders.map((salesOrder) => {
      const itemsOrdered = salesOrder.itemsOrdered.map((itemOrdered) => itemOrdered.item?.title);
      console.log("Items Ordered",itemsOrdered)
      return{
        Ref_Number: salesOrder.referenceNumber,
        Date: salesOrder.orderDate,
        Cutomer: salesOrder.customer?.name,
        Total: salesOrder.orderTotal,
        Paid_Amount: salesOrder.paidAmount,
        Remaining: salesOrder.remainingAmount,
        Payment_Status: salesOrder.paymentStatus,
        Order_Status: salesOrder.orderStatus,
        Payment_Method:salesOrder.paymentMethod,
        Items:itemsOrdered.join(', '),

      }
      
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return new Response(Buffer.from(excelBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="export-${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Failed to generate export',
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
