import { _extension } from '@altdot/extension';
import { MailDriver } from '../../interface/driver.interface';
import {
  SheetColumnsIndex,
  SheetValues,
} from '../../interface/sheet.interface';
import { mapColumnsRow } from '../sheet-data-parser';

const EL_SELECTOR = {
  recipientsInput: 'input[peoplekit-id]',
  emailBody: 'div[contenteditable="true"]',
  subjectInput: 'input[name="subjectbox"]',
  composeBtn: 'div[role="navigation"] div[role="button"]:not([data-tooltip])',
  sendBtn:
    'table[role="group"] div[role="button"][data-tooltip-delay]:not([aria-expanded])',
};

const MAX_TRY_TYPE = 3;

class GMailDriver implements MailDriver {
  constructor(
    readonly tab: _extension.Browser.Tabs.Tab,
    readonly columnsIndex: SheetColumnsIndex,
    readonly values: SheetValues,
  ) {}

  private async type(selector: string, text: string) {
    await this.tab.type(selector, text, { delay: 100 });
  }

  private async startCompose(value: string, tryCount = 1): Promise<void> {
    try {
      await this.tab.type(EL_SELECTOR.recipientsInput, value);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Couldn't find element") &&
        tryCount <= MAX_TRY_TYPE
      ) {
        await this.tab.click(EL_SELECTOR.composeBtn);
        await this.tab.waitForSelector(EL_SELECTOR.recipientsInput, {
          state: 'attached',
        });

        return await this.startCompose(value, tryCount + 1);
      }

      throw error;
    }
  }

  async start(): Promise<void> {
    for (const row of this.values) {
      const value = mapColumnsRow(this.columnsIndex, row);

      await this.startCompose(value.recipients);

      await this.type(EL_SELECTOR.subjectInput, value.subject);
      await this.type(EL_SELECTOR.emailBody, value.body);

      await this.tab.click(EL_SELECTOR.sendBtn);
      await this.tab.waitForSelector(EL_SELECTOR.recipientsInput, {
        state: 'detached',
      });
    }
  }
}

export default GMailDriver;
