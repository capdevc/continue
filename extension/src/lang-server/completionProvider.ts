import {
  CancellationToken,
  InlineCompletionContext,
  InlineCompletionItem,
  InlineCompletionItemProvider,
  InlineCompletionList,
  Position,
  ProviderResult,
  Range,
  TextDocument,
} from "vscode";

import { ideProtocolClient } from "../activation/activate";

export class ContinueCompletionProvider
  implements InlineCompletionItemProvider
{
  public async provideInlineCompletionItems(
    document: TextDocument,
    position: Position,
    context: InlineCompletionContext,
    token: CancellationToken
    //@ts-ignore
  ): ProviderResult<InlineCompletionItem[] | InlineCompletionList> {
    const filepath = document.uri.fsPath;

    if (token.isCancellationRequested) {
      return [];
    }

    return ideProtocolClient
      .getTabCompletion(filepath, position)
      .then((response: any) => this.toInlineCompletions(response, position))
      .finally(() => {});
  }

  private toInlineCompletions(
    value: string,
    position: Position
  ): InlineCompletionItem[] {
    if (value.trim().length <= 0) {
      return [];
    }

    return [
      new InlineCompletionItem(
        value,
        new Range(position, position.translate(0, value.length))
      ),
    ];
  }
}
