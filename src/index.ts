import "setimmediate";
import type { MessageReaderOptions, MessageWriterOptions, ReadableStreamMessageReader, WriteableStreamMessageWriter, } from "vscode-jsonrpc";
import { StreamMessageReader as _StreamMessageReader, StreamMessageWriter as _StreamMessageWriter } from "../node_modules/vscode-jsonrpc/lib/node/main";
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import type { WebContainerProcess } from "@webcontainer/api";
import { newStreamWritableFromWritableStream } from "./convert";

type Encoding = "ascii" | "utf-8";

export class StreamMessageReader extends _StreamMessageReader implements ReadableStreamMessageReader {
  constructor(readable: WebContainerProcess["output"], encoding?: Encoding | MessageReaderOptions) {
    super(new ReadableWebToNodeStream(readable) as unknown as NodeJS.ReadableStream, encoding);
  }
}

export class StreamMessageWriter extends _StreamMessageWriter implements WriteableStreamMessageWriter {
  constructor(writable: WebContainerProcess["input"], options?: Encoding | MessageWriterOptions) {
    super(newStreamWritableFromWritableStream(writable), options);
  }
}