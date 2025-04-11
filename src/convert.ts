import type { WebContainerProcess } from '@webcontainer/api';
// @ts-ignore
import { Writable, destroy as _destroy } from 'readable-stream'; // Userland Readable

function isWritableEnded(stream) {
  if (stream.writableEnded === true) return true;
  const wState = stream._writableState;
  if (wState?.errored) return false;
  if (typeof wState?.ended !== 'boolean') return null;
  return wState.ended;
}

const destroy = (...params) => {
  console.log('destroy', params);
  _destroy(...params);
}

// ADAPTED FROM: https://github.com/balena-io-modules/stream-adapters/blob/a5753108cc25ad60d7834cfe09f45d7e069314d4/lib/conversions.js#L127
export function newStreamWritableFromWritableStream(writableStream: WebContainerProcess["input"], options = {}) {
  const {
    highWaterMark,
    decodeStrings = true,
    objectMode = false,
    signal,
  } = options as {
    highWaterMark?: number;
    decodeStrings?: boolean;
    objectMode?: boolean;
    signal?: AbortSignal;
  };

  const writer = writableStream.getWriter();
  let closed = false;

  const writable = new Writable({
    highWaterMark,
    objectMode,
    decodeStrings,
    signal,

    writev(chunks, callback) {
      console.log('writev', chunks);

      function done(error) {
        try {
          callback(error);
        } catch (error) {
          Promise.resolve().then(() => destroy(writable, error));
        }
      }

      writer.ready.then(
        () => {
          return Promise.all(chunks.map((chunk) => writer.write(chunk))).then(
            done,
            done);
        },
        done);
    },

    write(chunk, encoding, callback) {
      console.log('write', chunk);
      if (typeof chunk === 'string' && decodeStrings && !objectMode) {
        chunk = Buffer.from(chunk, encoding);
        chunk = new Uint8Array(
          chunk.buffer,
          chunk.byteOffset,
          chunk.byteLength);
      }

      function done(error) {
        try {
          callback(error);
        } catch (error) {
          destroy(writable, error);
        }
      }

      writer.ready.then(() => {
        return writer.write(chunk).then(done, done);
      },
        done);
    },

    destroy(error, callback) {
      function done() {
        try {
          callback(error);
        } catch (error) {
          Promise.resolve().then(() => { throw error; });
        }
      }

      if (!closed) {
        if (error != null)
          writer.abort(error).then(done, done);
        else
          writer.close().then(done, done);
        return;
      }

      done();
    },

    final(callback) {
      function done(error) {
        try {
          callback(error);
        } catch (error) {
          Promise.resolve().then(() => destroy(writable, error));
        }
      }

      if (!closed) writer.close().then(done, done);
    },
  });

  writer.closed.then(
    () => {
      closed = true;
      if (!isWritableEnded(writable))
        destroy(writable, () => {
          throw new Error('Writable stream closed prematurely (I think?)');
        });
    },
    (error) => {
      closed = true;
      destroy(writable, error);
    });

  return writable as NodeJS.WritableStream;
}