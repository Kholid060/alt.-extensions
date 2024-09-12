import { load as loadHTML } from 'cheerio';
import { TableData } from '../interfaces/table.interface';

function tableHTMLToJSON(html: string): TableData {
  const tableData: TableData = [];

  const $ = loadHTML(html);
  const rows = $('tr');
  rows.each((index, row) => {
    const { cols } = $(row).extract({
      cols: ['th,td'],
    });
    tableData.push(cols);
  });

  return tableData;
}

export default tableHTMLToJSON;
