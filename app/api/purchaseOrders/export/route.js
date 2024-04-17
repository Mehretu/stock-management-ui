import * as XLSX from 'xlsx'; 
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { dateFrom, dateTo } = await request.json();

    const purchaseOrders = await db.purchaseOrder.findMany({
      where: {
        createdAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
      include: {
        supplier: true,
        purchaseRepresentative: true,
        itemsOrdered:{
          include:{
            item: true,
          }
        }

      },
    });

    // Map item data to Excel worksheet format
    const worksheetData = purchaseOrders.map((purchaseOrder) => {
      const itemsOrdered = purchaseOrder.itemsOrdered.map((itemOrdered) => itemOrdered.item?.title)
      return{
        Order_Number: purchaseOrder.orderNumber,
        Order_Date: purchaseOrder.orderDate,
        Supplier: purchaseOrder.supplier?.title,
        Delivery_Date: purchaseOrder.deliveryDate,
        Cost: purchaseOrder.totalCost,
        Status: purchaseOrder.purchaseStatus,
        Purchased_By: purchaseOrder.purchaseRepresentative?.name,
        Items: itemsOrdered.join(', ')

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
