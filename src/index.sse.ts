import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express, { Request, Response } from 'express';
import { server } from './MCP/mcpServer';
import { sendMessages } from './Helpers/commonHelper';
import Initializer from './initializer';

const app = express();
app.use(express.json());
const router = express.Router();
app.use('/', router);

const transports: { [sessionId: string]: SSEServerTransport } = {};

router.get('/connect', async (req: Request, res: Response) => {
    console.log('SSE connection request received');

    const transport = new SSEServerTransport('/messages', res);
    console.log('SSE transport created with session id:', transport.sessionId);

    transports[transport.sessionId] = transport;

    res.on('close', () => {
        console.log(
            'SSE connection closed for session id:',
            transport.sessionId
        );
        delete transports[transport.sessionId];
    });

    await server.connect(transport);

    await sendMessages(transport);
    return;
});

router.post('/messages', async (req: Request, res: Response) => {
    console.log('SSE message request received:', req.body);

    const sessionId = req.query.sessionId;

    if (typeof sessionId !== 'string') {
        res.status(400).send({ message: 'Bad session Id' });
        return;
    }

    const transport = transports[sessionId];

    if (!transport) {
        res.status(404).send({ message: 'No transport for this Session Id' });
        return;
    }

    await transport.handlePostMessage(req, res, req.body);
    return;
});

const PORT = 1515;
app.listen(PORT, () => {
    try {
        new Initializer().init();
        console.log(`MCP SSE Server listening on port ${PORT}`);
    } catch (error) {
        console.error('Error starting SSE server:', error);
        process.exit(1);
    }
});
