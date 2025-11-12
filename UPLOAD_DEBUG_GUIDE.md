# Upload Debugging Guide

## Changes Made

Enhanced logging has been added to both frontend and backend to help debug upload failures.

### Frontend Changes (`frontend/services/api.ts`)

The `uploadFile` function now logs:

- **Before Upload:**
  - File name, size, type
  - API URL being called
  - Timestamp and environment

- **During Upload:**
  - Request initiation timestamp
  - Fetch duration

- **Response Details:**
  - HTTP status and status text
  - Response headers (including CORS headers)
  - Whether request was redirected
  - Response type

- **Error Details:**
  - Raw error response text
  - Content-type of failed responses
  - Full error stack traces
  - Error type classification
  - Request duration even on failure

### Backend Changes (`backend/controllers/uploadController.ts`)

The upload handler now logs:

- **Request Details:**
  - Timestamp
  - HTTP method and URL
  - Request headers (content-type, content-length, origin for CORS debugging)
  - Client IP and protocol

- **File Details:**
  - All Multer file metadata (fieldname, encoding, mimetype, destination, path, size)

- **Processing Steps:**
  - Validation status
  - Text extraction progress with character counts
  - Embedding creation
  - Database save operations

- **Timing:**
  - Total request duration

- **Errors:**
  - Full error messages and stack traces
  - Error type classification
  - Duration even on failure

### Logger Utility Updates (`backend/utils/logger.ts`)

Updated to support structured logging with JSON data objects.

## How to Debug

### 1. Check Frontend Console

Open browser DevTools (F12) and look for `[Upload]` prefixed logs:

```
[Upload] Starting file upload: { fileName, fileSize, fileType, apiUrl, timestamp, environment }
[Upload] FormData created, sending request to backend...
[Upload] Fetch initiated at: [timestamp]
[Upload] Response received: { status, statusText, ok, fetchDuration, headers, url, redirected, type }
```

**Key things to check:**
- Is the API URL correct? (should point to your backend)
- What HTTP status is returned?
- Are there CORS errors in headers?
- Does the request redirect?

### 2. Check Backend Logs (Vercel)

In Vercel dashboard → Your Project → Deployments → [Latest] → Functions tab, look for:

```
[INFO] Upload request received
[INFO] File received: [filename], mimetype: [type], size: [bytes]
[INFO] File validation passed for: [filename]
[INFO] Extracting text from [type]: [filename]
[INFO] Creating embedding...
[INFO] Saving file to database...
[INFO] File upload completed successfully
```

**If you see:**
- No logs at all → Request not reaching backend (check API URL, CORS, or network)
- "File validation failed" → File type not supported or missing
- Error during text extraction → File parsing issue
- Error during embedding → OpenAI API issue
- Error during database save → Supabase connection issue

### 3. Common Issues

**No backend logs in Vercel:**
- Frontend is calling wrong API URL
- CORS is blocking the request
- Request timeout before reaching backend

**400 errors:**
- File validation failure (unsupported file type)
- No file uploaded
- Check supported types: PDF, DOCX, TXT

**500 errors:**
- Text extraction failure
- Embedding creation failure (OpenAI API key issue)
- Database save failure (Supabase connection)

**Network errors:**
- Check API URL environment variable
- Verify backend is deployed and running
- Check for CORS configuration

## Environment Variables to Verify

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Should point to your backend URL

**Backend:**
- `OPENAI_API_KEY` - For embedding creation
- `SUPABASE_URL` - For database connection
- `SUPABASE_SERVICE_KEY` - For database authentication

## Next Steps

1. Try uploading a file
2. Check frontend console for detailed logs
3. Check Vercel backend logs for corresponding entries
4. Share the relevant logs to identify where the failure occurs
