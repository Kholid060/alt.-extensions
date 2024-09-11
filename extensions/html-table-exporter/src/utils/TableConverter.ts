import { writeFile } from 'fs/promises';
import { TableData } from '../interfaces/table.interface';
import writeXlsxFile from 'write-excel-file/node';
import { SheetData } from 'write-excel-file';

class TableConverter {
  static async toCSV(data: TableData, saveLocation: string) {
    const csvStr = data.map((rows) => rows.join(',')).join('\n');
    await writeFile(saveLocation, '\ufeff' + csvStr);
  }

  static async toJSON(data: TableData, saveLocation: string) {
    await writeFile(saveLocation, JSON.stringify(data, null, 2));
  }

  static async toExcel(data: TableData, saveLocation: string) {
    const sheetData: SheetData = data.map((row) =>
      row.map((value) => ({ value })),
    );
    await writeXlsxFile(sheetData, {
      filePath: saveLocation,
    });
  }
}

export default TableConverter;
