import { EdgeDBStream, StreamingTextResponse, StreamData } from '.';
import {
  edgeDBMessageChunks,
} from '../tests/snapshots/edgedb';
import { readAllChunks } from '../tests/utils/mock-client';
import { createMockServer } from '../tests/utils/mock-server';

export const MESSAGE_URL = 'http://localhost:3030/messages';

const server = createMockServer([
  {
    url: MESSAGE_URL,
    chunks: edgeDBMessageChunks,
    formatChunk: chunk => chunk,
  },
]);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('EdgeDB', () => {
  it('should send text', async () => {
    const data = new StreamData();

    const stream = EdgeDBStream(await fetch(MESSAGE_URL), {
      onFinal() {
        data.close();
      },
    });

    const response = new StreamingTextResponse(stream, {}, data);

    expect(await readAllChunks(response)).toEqual([
      '0:"Hello"\n',
      '0:","\n',
      '0:" world"\n',
      '0:"."\n',
    ]);
  });

  it('should send text and data', async () => {
    const data = new StreamData();

    data.append({ t1: 'v1' });

    const stream = EdgeDBStream(await fetch(MESSAGE_URL), {
      onFinal() {
        data.close();
      },
    });

    const response = new StreamingTextResponse(stream, {}, data);

    expect(await readAllChunks(response)).toEqual([
      '2:[{"t1":"v1"}]\n',
      '0:"Hello"\n',
      '0:","\n',
      '0:" world"\n',
      '0:"."\n',
    ]);
  });
});

