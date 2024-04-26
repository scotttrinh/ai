export const edgeDBMessageChunks = [
  'event: message_start\n' +
    `data: {"type":"message_start","message":{"id":"msg_014dMY5QPLaAa31KcjEnwDJg",` +
    `"type":"message","role":"assistant","content":[],"model":"claude-2.1",` +
    `"stop_reason":null,"stop_sequence":null}}\n\n`,
  'event: content_block_start\n' +
    `data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n\n`,
  `event: ping\ndata: {"type": "ping"}\n\n`,
  'event: content_block_delta\n' +
    `data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}\n\n`,
  'event: content_block_delta\n' +
    `data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}\n\n`,
  'event: content_block_delta\n' +
    `data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" world"}}\n\n`,
  'event: content_block_delta\n' +
    `data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}\n\n`,
  'event: content_block_stop\n' +
    `data: {"type":"content_block_stop","index":0}\n\n`,
  'event: message_delta\n' +
    `data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null}}\n\n`,
  `event: message_stop\ndata: {"type":"message_stop"}\n\n`,
];
