import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
    InitializeRequestSchema,
    JSONRPCError,
} from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { sendMessages } from '../Helpers/commonHelper';

const SESSION_ID_HEADER_NAME = 'mcp-session-id';

export default class MCPServerStreamableHTTP {
    private server: Server;

    private transports: { [sessionId: string]: StreamableHTTPServerTransport } =
        {};

    constructor(server: Server) {
        this.server = server;
    }

    async handleGetRequest(req: Request, res: Response) {
        console.log('Get Request received');

        res.status(405).set('Allow', 'POST').send('Method Not Allowed');
        return;
    }

    async handlePostRequest(req: Request, res: Response) {
        const sessionId = req.headers[SESSION_ID_HEADER_NAME] as string;

        console.log('Post Request received for session id:', sessionId);
        console.log('Request body:', req.body);

        let transport: StreamableHTTPServerTransport;

        try {
            if (sessionId && this.transports[sessionId]) {
                transport = this.transports[
                    sessionId
                ] as StreamableHTTPServerTransport;
                await transport.handleRequest(req, res, req.body);
                return;
            }

            //create new transport
            if (!sessionId && this.isInitializeRequest(req.body)) {
                const transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                    //for stateless mode use sessionIdGenerator: () => undefined,
                });

                await this.server.connect(transport);
                await transport.handleRequest(req, res, req.body);

                const sessionId = transport.sessionId;
                if (sessionId) {
                    this.transports[sessionId] = transport;
                }
                await sendMessages(transport);
                return;
            }

            res.status(400).json(
                this.createErrorResponse(
                    'Bad Request: invalid session Id or method.'
                )
            );
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).json(
                this.createErrorResponse('Internal Server Error')
            );
            return;
        }
    }

    private createErrorResponse(message: string): JSONRPCError {
        return {
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: message,
            },
            id: randomUUID(),
        };
    }

    private isInitializeRequest(body: any): boolean {
        const isInitial = (data: any) => {
            const result = InitializeRequestSchema.safeParse(data);
            return result.success;
        };

        if (Array.isArray(body)) {
            return body.some((request) => isInitial(request));
        }
        return isInitial(body);
    }
}
