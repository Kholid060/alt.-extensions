export type TableData = string[][];

export type TableExportType = 'csv' | 'excel' | 'json';

export interface TableExporterArguments {
  exportAs?: TableExportType;
}
