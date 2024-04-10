// vitest.setup.js or similar setup file
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;
// Setup DOMParser
global.DOMParser = dom.window.DOMParser;