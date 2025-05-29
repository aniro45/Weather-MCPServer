import express, { Request, Response } from 'express';
import { server } from './MCP/mcpServer';
import Initializer from './initializer';
import MCPServerStreamableHTTP from './StreamableHTTP/MCPServer';

const app = express();
app.use(express.json());
const router = express.Router();
app.use('/', router);

const streamableHttpServer = new MCPServerStreamableHTTP(server);

router.get('/mcp', async (req: Request, res: Response) => {
    await streamableHttpServer.handleGetRequest(req, res);
});

router.post('/mcp', async (req: Request, res: Response) => {
    await streamableHttpServer.handlePostRequest(req, res);
});

const PORT = 1516;
app.listen(PORT, () => {
    try {
        new Initializer().init();
        console.log(`MCP HTTP Streamable Server listening on port ${PORT}`);
    } catch (error) {
        console.error('Error starting  HTTP Streamable server:', error);
        process.exit(1);
    }
});
