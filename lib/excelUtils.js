import * as XLSX from 'xlsx';

export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
    try{
        const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      if(!workbook.SheetNames || workbook.SheetNames.length === 0){
        throw new Error("The selected file does not contain any sheets,");
      }

      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];

      if(!worksheet){
        throw new Error("The selected sheet is empty.");
      }
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if(jsonData.length === 0 || jsonData[0].length !== 9){
        throw new Error('The selected file does not contain valid item data.');
      }

      const items = jsonData.slice(1).map((row) => ({
        title: row[0],
        category: row[1],
        itemNumber: row[2],
        quantity: row[3],
        unit: row[4],
        brand: row[5],
        buyingPrice: row[6],
        sellingPrice: row[7],
        taxRate: row[8],
      }));

      resolve(items);

    }catch(error){
        reject(error)
    }
      
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export async function parseExcelFileForSalesOrders(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length < 2) {
          throw new Error("The selected file does not contain at least two sheets.");
        }

        // Access both sheets
        const salesOrdersSheetName = workbook.SheetNames[0];
        const salesOrdersWorksheet = workbook.Sheets[salesOrdersSheetName];

        const itemsOrderedSheetName = workbook.SheetNames[1];
        const itemsOrderedWorksheet = workbook.Sheets[itemsOrderedSheetName];

        if (!salesOrdersWorksheet || !itemsOrderedWorksheet) {
          throw new Error("One or both of the selected sheets are empty or don't exist.");
        }

        // Parse sales orders data
        const salesOrdersData = XLSX.utils.sheet_to_json(salesOrdersWorksheet, { header: 1 ,range: 1});

        console.log("Sales Order Data",salesOrdersData);

        // Parse items ordered data
        const itemsOrderedData = XLSX.utils.sheet_to_json(itemsOrderedWorksheet, { header: 1,range: 1});
        console.log("Items Ordered Data",itemsOrderedData)

        // Combine data
        const parsedData = salesOrdersData.map((salesOrderRow) => {
          const orderId = salesOrderRow[0]
          console.log("Order Id",orderId)
          const itemsOrdered = itemsOrderedData.filter((itemRow) => itemRow[0] === orderId).map((itemRow) => ({
            itemName: itemRow[1], 
            itemNumber: itemRow[2],
            quantity: itemRow[3],
            price:itemRow[4], 
            total:itemRow[5],
          }));

          return {
            orderId: orderId,
            customer: salesOrderRow[1],
            email: salesOrderRow[2],
            company: salesOrderRow[3],
            tinNumber: salesOrderRow[4],
            vat: salesOrderRow[5],
            paidAmount:salesOrderRow[6],
            paymentMethod:salesOrderRow[7], 
            itemsOrdered: itemsOrdered,
          };
        });

        resolve(parsedData);

      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export async function parseExcelFileForPurchaseOrders(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length < 2) {
          throw new Error("The selected file does not contain at least two sheets.");
        }

        // Access both sheets
        const purchaseOrdersSheetName = workbook.SheetNames[0];
        const purchaseOrdersWorksheet = workbook.Sheets[purchaseOrdersSheetName];

        const itemsOrderedSheetName = workbook.SheetNames[1];
        const itemsOrderedWorksheet = workbook.Sheets[itemsOrderedSheetName];

        if (!purchaseOrdersWorksheet || !itemsOrderedWorksheet) {
          throw new Error("One or both of the selected sheets are empty or don't exist.");
        }

        // Parse sales orders data
        const purchaseOrdersData = XLSX.utils.sheet_to_json(purchaseOrdersWorksheet, { header: 1 ,range: 1});

        console.log("Sales Order Data",purchaseOrdersData);

        // Parse items ordered data
        const itemsOrderedData = XLSX.utils.sheet_to_json(itemsOrderedWorksheet, { header: 1,range: 1});
        console.log("Items Ordered Data",itemsOrderedData)

        // Combine data
        const parsedData = purchaseOrdersData.map((purchaseOrderRow) => {
          const orderId = purchaseOrderRow[0]
          console.log("Order Id",orderId)
          const itemsOrdered = itemsOrderedData.filter((itemRow) => itemRow[0] === orderId).map((itemRow) => ({
            itemName: itemRow[1], 
            itemNumber: itemRow[2],
            quantity: itemRow[3],
            price:itemRow[4], 
            total:itemRow[5],
          }));

          return {
            orderId: orderId,
            supplier: purchaseOrderRow[1],
            orderNumber: purchaseOrderRow[2],
            deliveryDate: purchaseOrderRow[3],
            deliveryLocation:purchaseOrderRow[4],
            vat:purchaseOrderRow[5], 
            itemsOrdered: itemsOrdered,
          };
        });

        resolve(parsedData);

      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
