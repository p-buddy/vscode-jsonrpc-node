import type { MessageReaderOptions, MessageWriterOptions, ReadableStreamMessageReader, WriteableStreamMessageWriter, } from "vscode-jsonrpc";
import { StreamMessageReader as _StreamMessageReader, StreamMessageWriter as _StreamMessageWriter } from "../node_modules/vscode-jsonrpc/lib/node/main";
import type { WebContainerProcess } from "@webcontainer/api";
import { Writable, Readable } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';

export declare class StreamMessageWriterType extends WriteableStreamMessageWriter {
  constructor(writable: NodeJS.WritableStream, options?: ("ascii" | "utf-8") | MessageWriterOptions);
}

export class StreamMessageReader extends _StreamMessageReader implements ReadableStreamMessageReader {
  constructor(readable: WebContainerProcess["output"], encoding?: ("ascii" | "utf-8") | MessageReaderOptions) {
    super(Readable.fromWeb(readable as ReadableStream<any>), encoding);
  }
}

export class StreamMessageWriter extends _StreamMessageWriter implements WriteableStreamMessageWriter {
  constructor(writable: WebContainerProcess["input"], options?: ("ascii" | "utf-8") | MessageWriterOptions) {
    super(Writable.fromWeb(writable), options);
  }
}