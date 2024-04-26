import {
  AIStream,
  readableFromAsyncIterable,
  type AIStreamCallbacksAndOptions,
  createCallbacksTransformer,
} from './ai-stream';
import { createStreamDataTransformer } from './stream-data';

interface Message {
  id: string;
  content: Array<ContentBlock>;
  model: string;
  role: 'assistant';
  stop_reason: string | null;
  stop_sequence: string | null;
  type: 'message';
}

interface ContentBlock {
  text: string;
  type: 'text';
}

interface TextDelta {
  text: string;
  type: 'text_delta';
}

interface ContentBlockDeltaEvent {
  delta: TextDelta;
  index: number;
  type: 'content_block_delta';
}

interface ContentBlockStartEvent {
  content_block: ContentBlock;
  index: number;
  type: 'content_block_start';
}

interface ContentBlockStopEvent {
  index: number;
  type: 'content_block_stop';
}

interface MessageDeltaEventDelta {
  stop_reason: string | null;
  stop_sequence: string | null;
}

interface MessageDeltaEvent {
  delta: MessageDeltaEventDelta;
  type: 'message_delta';
}

interface MessageStartEvent {
  message: Message;
  type: 'message_start';
}

interface MessageStopEvent {
  type: 'message_stop';
}

type MessageStreamEvent =
  | MessageStartEvent
  | MessageDeltaEvent
  | MessageStopEvent
  | ContentBlockStartEvent
  | ContentBlockDeltaEvent
  | ContentBlockStopEvent;

function maybeGetTextFromMessage(message: MessageStreamEvent): string | null {
  return message.type === 'content_block_start'
    ? message.content_block.text
    : message.type === 'content_block_delta'
    ? message.delta.text
    : null;
}

function parseEdgeDBStream(data: string): string | void {
  const json = JSON.parse(data as string) as MessageStreamEvent;
  const maybeText = maybeGetTextFromMessage(json);
  if (maybeText) return maybeText;
}

async function* streamable(stream: AsyncIterable<MessageStreamEvent>) {
  for await (const chunk of stream) {
    const maybeText = maybeGetTextFromMessage(chunk);
    if (maybeText) yield maybeText;
  }
}

/**
 * Accepts a fetch Response from an EdgeDB RAG stream, like the one returned by
 * `@edgedb/ai`'s `streamRag` function or the return value of `@edgedb/ai`'s
 * `getRagAsyncGenerator`.
 */
export function EdgeDBStream(
  res: Response | AsyncIterable<MessageStreamEvent>,
  cb?: AIStreamCallbacksAndOptions,
): ReadableStream {
  if (Symbol.asyncIterator in res) {
    return readableFromAsyncIterable(streamable(res))
      .pipeThrough(createCallbacksTransformer(cb))
      .pipeThrough(createStreamDataTransformer());
  } else {
    return AIStream(res, parseEdgeDBStream, cb).pipeThrough(
      createStreamDataTransformer(),
    );
  }
}
