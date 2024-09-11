export interface ProcessItem {
  cpu: number;
  name: string;
  path: string;
  memory: number;
  processName: string;
}

export interface ProcessRawData {
  Path: string;
  Product: string;
  ProcessName: string;
  MainWindowTitle: string | null;
}

export interface ProcessPerformanceData {
  Name: string;
  WorkingSetPrivate: number;
  PercentProcessorTime: number;
}
