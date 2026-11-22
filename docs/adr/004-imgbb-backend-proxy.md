# ADR 004: ImgBB Secure Backend Proxy

## Status: Accepted
## Context:
Client-side direct upload exposes the private ImgBB API Key in browser networks.
## Decision:
Client uploads via multipart form to backend `/api/uploads/image`, keeping API keys strictly private.
