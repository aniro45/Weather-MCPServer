import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export async function sendMessages(
    transport: SSEServerTransport | StreamableHTTPServerTransport
) {
    try {
        transport.send({
            jsonrpc: '2.0',
            method: 'see/connection',
            params: {
                message: 'stream started',
            },
        });
        console.log('stream started');

        let messageCount = 0;
        const interval = setInterval(async () => {
            messageCount++;

            const message = `message ${messageCount} at ${new Date().toISOString()}`;

            try {
                await transport.send({
                    jsonrpc: '2.0',
                    method: 'sse/message',
                    params: {
                        message: message,
                    },
                });
                console.log('Message sent:', message);

                if (messageCount === 2) {
                    clearInterval(interval);
                    await transport.send({
                        jsonrpc: '2.0',
                        method: 'sse/complete',
                        params: {
                            message: 'stream completed',
                        },
                    });
                    console.log('Stream completed');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                clearInterval(interval);
            }
        }, 1000);
    } catch (error) {
        console.error('Error sending messages:', error);
    }
}
