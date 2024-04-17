// Import necessary modules
import * as XLSX from 'xlsx'; // Import xlsx library for Excel generation
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Define the POST route handler
export async function POST(request) {
  try {
    const { dateFrom, dateTo } = await request.json();

    // Retrieve items based on date range (assuming a 'createdAt' field)
    const items = await db.item.findMany({
      where: {
        createdAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
      include: {
        category: true,
        brand: true,
        unit: true,
        priceHistory: true,
      },
    });

    const worksheetData = items.map((item) => {
      const sellingPrices = item.priceHistory.map((price) => price.sellingPrice);
      return{
        Title: item.title,
        Category: item.category?.title,
        ItemNumber: item.itemNumber,
        Quantity: item.quantity,
        Unit: item.unit?.title,
        Brand: item.brand?.title,
        BuyingPrice: item.buyingPrice,
        SellingPrice: item.sellingPrice,
        Price_History: sellingPrices.join(', '),

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
