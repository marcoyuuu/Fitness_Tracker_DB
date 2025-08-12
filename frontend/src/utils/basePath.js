// Detect app base path when hosted under a subpath like /~user/app
// Precedence: PUBLIC_URL env -> /~user/app pattern -> ''
export function getBasePath() {
  const fromEnv = process.env.PUBLIC_URL;
  if (fromEnv && fromEnv !== '.') {
    return fromEnv.endsWith('/') ? fromEnv.slice(0, -1) : fromEnv;
  }
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  // Match leading "/~user/app" two segments when present
  const match = path.match(/^\/~[^/]+\/[A-Za-z0-9._-]+/);
  return match ? match[0] : '';
}
