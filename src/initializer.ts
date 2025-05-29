import {
    setRequestHandlerForListToolSchema,
    setRequestHandlerForCallToolSchema,
} from './MCP/requestHandlers';

export default class Initializer {
    constructor() {
        // Constructor can be used for any setup if needed
    }

    init() {
        setRequestHandlerForListToolSchema();
        setRequestHandlerForCallToolSchema();
    }
}
