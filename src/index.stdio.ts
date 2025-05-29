import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import Initializer from './initializer';
import { server } from './MCP/mcpServer';

async function main() {
    try {
        const initializer = new Initializer();
        initializer.init();
        const transport = new StdioServerTransport();
        server.connect(transport);
    } catch (error) {
        console.error('Error starting the application:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});

///Users/ajstyle45/Documents/MyCodes/Weather/WeatherMCPServer/dist/index.stdio.js
