import {
  _extension,
  CommandLaunchBy,
  CommandLaunchContext,
} from '@altdot/extension';
import {
  TableExportType,
  TableExporterArguments,
} from './interfaces/table.interface';
import { ConfigTableExporter } from './interfaces/config.interface';
import { homedir } from 'os';
import * as path from 'path';
import TableConverter from './utils/TableConverter';
import tableHTMLToJSON from './utils/tableHTMLToJSON';

const TABLE_FILE_EXTENSION: Record<TableExportType, string> = {
  csv: 'csv',
  json: 'json',
  excel: 'xlsx',
};

async function getConfig(
  tabUrl: string,
  exportAs: TableExportType,
): Promise<Required<ConfigTableExporter>> {
  const config =
    await _extension.runtime.config.getValues<ConfigTableExporter>('command');
  const filename = `${new URL(tabUrl).hostname}-table-${Date.now()}.${TABLE_FILE_EXTENSION[exportAs]}`;

  return {
    showWhenDone: config.showWhenDone ?? false,
    saveLocation: path.join(
      config.saveLocation ?? path.join(homedir(), 'Documents'),
      filename,
    ),
  };
}

async function actionCommand({
  args,
  launchBy,
}: CommandLaunchContext<TableExporterArguments>) {
  const isInWorkflow = launchBy === CommandLaunchBy.WORKFLOW;

  try {
    const activeTab = await _extension.browser.tabs.getActive();
    if (!activeTab) throw new Error('Missing browser active tab');

    const tableSelector = await activeTab.selectElement({
      title: 'Select a table',
      filter: {
        selector: 'table',
        closestSelector: 'table',
      },
    });
    if (tableSelector.canceled) return null;

    const tableHTML = await tableSelector.el.getHTML({ outerHTML: true });
    const tableData = tableHTMLToJSON(tableHTML);

    const exportAs = args.exportAs || 'csv';
    const commandConfig = await getConfig(activeTab.url, exportAs);

    switch (exportAs) {
      case 'csv':
        await TableConverter.toCSV(tableData, commandConfig.saveLocation);
        break;
      case 'excel':
        await TableConverter.toExcel(tableData, commandConfig.saveLocation);
        break;
      case 'json':
        await TableConverter.toJSON(tableData, commandConfig.saveLocation);
        break;
      default:
        throw new Error(`"${exportAs}" is invalid export type`);
    }

    if (commandConfig.showWhenDone && !isInWorkflow) {
      await _extension.shell.showItemInFolder(commandConfig.saveLocation);
    } else if (!isInWorkflow) {
      _extension.ui.showToast({
        title: 'Table successfully exported',
      });
    }

    return {
      filePath: commandConfig.saveLocation,
    };
  } catch (error) {
    if (isInWorkflow) throw error;

    _extension.ui.showToast({
      type: 'error',
      title: (error as Error).message,
    });
  }
}

export default actionCommand;
