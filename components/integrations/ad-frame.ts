// Isolate provider globals and document.write from React. Input is exclusively
// the trusted, unchanged GET CODE in config/adsterra.ts, never runtime user input.
export function createAdFrame(code: string, title: string): HTMLIFrameElement {
  const frame = document.createElement("iframe");
  frame.title = title;
  frame.className = "adsterra-frame";
  frame.srcdoc = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0}</style></head><body>${code}</body></html>`;
  return frame;
}
