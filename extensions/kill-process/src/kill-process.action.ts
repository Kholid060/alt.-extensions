import { _extension } from '@altdot/extension';
import { exec } from 'child_process';
import {
  ProcessPerformanceData,
  ProcessRawData,
  ProcessItem,
} from './interfaces/process.interface';

async function powershellRunner<T = unknown>(
  command: string,
  parseResult = true,
): Promise<T> {
  const result = await new Promise<string>((resolve, reject) => {
    exec(command, { shell: 'powershell.exe' }, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });

  return parseResult ? JSON.parse(result) : result;
}

_extension.viewAction.async.on('process:get-all', async () => {
  const [rawData, processes] = await Promise.all([
    powershellRunner<ProcessPerformanceData[]>(
      "Get-WmiObject Win32_PerfFormattedData_PerfProc_Process | Where-Object { $_.name -inotmatch '_total|idle|svchost|taskhost' } | Select-Object -Property Name,PercentProcessorTime,WorkingSetPrivate | ConvertTo-Json",
    ),
    powershellRunner<ProcessRawData[]>(
      "Get-Process | Select-Object -Property ProcessName, Path, Product, MainWindowTitle | Where-Object {$_.ProcessName -inotmatch 'svchost|taskhost|wsmprovhost' -and $_.Path -ne $null} | ConvertTo-Json",
    ),
  ]);

  const data = processes.reduce<Record<string, ProcessItem>>((acc, item) => {
    if (!acc[item.ProcessName]) {
      let name = item.MainWindowTitle || item.Product || item.ProcessName;
      // Windowsr => Windows®
      if (name?.includes('Windowsr Operating System')) {
        name = item.ProcessName;
      }

      acc[item.ProcessName] = {
        name,
        cpu: 0,
        memory: 0,
        path: item.Path,
        processName: item.ProcessName,
      };
    }

    return acc;
  }, {});

  rawData.forEach((item) => {
    const hashIndex = item.Name.indexOf('#');
    const name = hashIndex === -1 ? item.Name : item.Name.slice(0, hashIndex);
    if (!data[name]) return;

    data[name].cpu += item.PercentProcessorTime;
    data[name].memory += item.WorkingSetPrivate;
  });

  return Object.values(data);
});

_extension.viewAction.sync.on('process:kill', (processName) => {
  powershellRunner(`Stop-Process -Name "${processName}"`, false);
});
