/**
 * upload-statements — Mode B transport for the Leverup Liquidity application form.
 * ---------------------------------------------------------------------------
 * Why this exists: Web3Forms file attachments are a PRO-tier feature
 * (docs.web3forms.com/getting-started/pro-features/file-attachments). On the
 * free tier a submission carrying files is rejected outright, which would fail
 * the ENTIRE application. This function accepts the statements separately and
 * returns a retrieval URL, which the form then sends to Web3Forms as plain text.
 *
 * Contract with the front end (apply.html -> uploadOne()):
 *   POST /.netlify/functions/upload-statements?name=<filename>&type=<mime>
 *        Content-Type: application/octet-stream
 *        body: raw file bytes
 *   -> 200 { "url": "https://<site>/.netlify/functions/upload-statements?get=<key>" }
 *
 *   GET  /.netlify/functions/upload-statements?get=<key>&t=<token>
 *   -> the stored file
 *
 * Raw-body upload (rather than multipart) is deliberate: it avoids pulling in a
 * multipart parser such as busboy, keeping the dependency surface to one package.
 *
 * DEPLOY REQUIREMENTS
 *   1. npm install @netlify/blobs   (in the repo root, or netlify/functions/)
 *   2. Netlify Blobs must be enabled for the site (it is, on all current plans).
 *   3. Set env var STATEMENTS_TOKEN_SECRET to a long random string.
 *
 * SECURITY NOTE — READ BEFORE SHIPPING
 *   Bank statements are high-sensitivity PII (account and routing numbers).
 *   Retrieval below is protected only by an unguessable key + HMAC token, i.e.
 *   capability-URL security: anyone holding the link can read the file, and the
 *   link travels through email. That is weaker than an authenticated document
 *   portal. Treat this as a stopgap. For production, prefer either the Pro
 *   Web3Forms attach path (files go straight into the broker's inbox and are
 *   never stored here) or a real portal with per-user auth, encryption at rest
 *   with a managed key, and a documented retention/deletion schedule.
 */

'use strict';

var blobs = require('@netlify/blobs');
var crypto = require('crypto');

var STORE_NAME = 'bank-statements';
var MAX_BYTES = 10 * 1024 * 1024;          // must mirror UPLOAD_CONFIG.maxFileBytes
var RETENTION_NOTE = '30 days';            // enforce with a scheduled cleanup function
var ALLOWED_EXT = ['pdf', 'png', 'jpg', 'jpeg', 'heic', 'webp'];
var ALLOWED_MIME = [
  'application/pdf', 'image/png', 'image/jpeg',
  'image/heic', 'image/heif', 'image/webp', 'application/octet-stream'
];

function json(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}

function secret() {
  return process.env.STATEMENTS_TOKEN_SECRET || '';
}

function sign(key) {
  return crypto.createHmac('sha256', secret()).update(key).digest('hex').slice(0, 32);
}

// Strip any path components and anything that isn't a safe filename character.
function safeName(raw) {
  var base = String(raw || 'statement').split(/[\\/]/).pop();
  return base.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120) || 'statement';
}

function extensionOf(name) {
  var dot = name.lastIndexOf('.');
  return dot > -1 ? name.slice(dot + 1).toLowerCase() : '';
}

exports.handler = async function (event) {
  if (!secret()) {
    // Fail closed rather than serving files with a guessable token.
    return json(500, { error: 'STATEMENTS_TOKEN_SECRET is not configured' });
  }

  var params = event.queryStringParameters || {};
  var store = blobs.getStore(STORE_NAME);

  /* ---------------- retrieval ---------------- */
  if (event.httpMethod === 'GET' && params.get) {
    var key = String(params.get);
    if (sign(key) !== String(params.t || '')) {
      return json(403, { error: 'invalid or expired link' });
    }
    var entry = await store.getWithMetadata(key, { type: 'arrayBuffer' });
    if (!entry) return json(404, { error: 'not found' });
    var meta = entry.metadata || {};
    return {
      statusCode: 200,
      headers: {
        'Content-Type': meta.type || 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="' + safeName(meta.name) + '"',
        'Cache-Control': 'no-store'
      },
      body: Buffer.from(entry.data).toString('base64'),
      isBase64Encoded: true
    };
  }

  /* ---------------- upload ---------------- */
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method not allowed' });
  }

  var name = safeName(params.name);
  var type = String(params.type || 'application/octet-stream').toLowerCase();

  if (ALLOWED_EXT.indexOf(extensionOf(name)) === -1) {
    return json(415, { error: 'unsupported file type' });
  }
  // Server-side re-check: the browser-side gate in apply.html is UX, not security.
  if (ALLOWED_MIME.indexOf(type) === -1 && type.indexOf('image/') !== 0) {
    return json(415, { error: 'unsupported content type' });
  }

  var body = event.body || '';
  var buf = event.isBase64Encoded ? Buffer.from(body, 'base64') : Buffer.from(body, 'binary');

  if (!buf.length) return json(400, { error: 'empty body' });
  if (buf.length > MAX_BYTES) return json(413, { error: 'file too large' });

  // Confirm a .pdf really is a PDF before we store it.
  if (extensionOf(name) === 'pdf' && buf.slice(0, 4).toString('latin1') !== '%PDF') {
    return json(415, { error: 'not a readable PDF' });
  }

  var blobKey = crypto.randomBytes(24).toString('hex') + '-' + name;
  await store.set(blobKey, buf, {
    metadata: {
      name: name,
      type: type,
      size: buf.length,
      uploadedAt: new Date().toISOString(),
      retention: RETENTION_NOTE
    }
  });

  var origin = 'https://' + (event.headers && (event.headers['x-forwarded-host'] || event.headers.host));
  return json(200, {
    url: origin + '/.netlify/functions/upload-statements?get=' +
         encodeURIComponent(blobKey) + '&t=' + sign(blobKey),
    name: name,
    size: buf.length
  });
};
