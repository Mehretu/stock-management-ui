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
        taxRate: row[9],
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
