import type { MessageReaderOptions, MessageWriterOptions, ReadableStreamMessageReader, WriteableStreamMessageWriter, } from "vscode-jsonrpc";
import { StreamMessageReader as _StreamMessageReader, StreamMessageWriter as _StreamMessageWriter } from "../node_modules/vscode-jsonrpc/lib/node/main";

export declare class StreamMessageReaderType extends ReadableStreamMessageReader {
  constructor(readable: NodeJS.ReadableStream, encoding?: ("ascii" | "utf-8") | MessageReaderOptions);
}
export declare class StreamMessageWriterType extends WriteableStreamMessageWriter {
  constructor(writable: NodeJS.WritableStream, options?: ("ascii" | "utf-8") | MessageWriterOptions);
}

const StreamMessageReader = _StreamMessageReader as any as StreamMessageReaderType;
const StreamMessageWriter = _StreamMessageWriter as any as StreamMessageWriterType;

export { StreamMessageReader, StreamMessageWriter };