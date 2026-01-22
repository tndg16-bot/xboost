# Technical Specification: Xboost Public API (#104)

**Status:** Draft  
**Version:** 1.0.0  
**Priority:** Low (Phase 3+)  
**Authors:** Technical Writer Agent

---

## 1. Overview
The Xboost Public API provides programmatic access to Xboost's core functionalities, enabling third-party integrations, custom workflow automation, and external dashboard synchronization.

### 1.1 Purpose
- Empower developers to build custom tools on top of Xboost.
- Support enterprise workflows (e.g., syncing posts from a CMS).
- Provide raw data for advanced analytics beyond the built-in dashboard.

### 1.2 Target Audience
- Third-party tool developers.
- Enterprise customers with custom internal tools.
- Power users seeking advanced automation.

---

## 2. System Architecture

### 2.1 API Style
- **RESTful API**: Standard HTTP methods (GET, POST, PATCH, DELETE).
- **Format**: JSON request/response bodies.
- **Base URL**: `https://api.xboost.now/v1`

### 2.2 Authentication
Two mechanisms will be supported:

#### 2.2.1 API Keys (Primary)
- Users can generate multiple API keys from the Xboost Settings dashboard.
- **Header**: `X-API-Key: <your_api_key>`
- **Scope**: Keys can be restricted to "Read-only" or "Full Access".

#### 2.2.2 OAuth 2.0 (Future)
- Authorization Code Flow with PKCE for third-party application integration.

### 2.3 Rate Limiting
To ensure system stability, the following limits apply per API key:
- **Free Tier**: 100 requests / 15 minutes.
- **Pro Tier**: 1,000 requests / 15 minutes.
- **Enterprise**: Custom limits.

*Note: Rate limit status will be returned in headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).*

---

## 3. Endpoint Specifications

### 3.1 Posts Management

#### `POST /posts`
Create a new post draft or publish immediately.
- **Request Body**:
  ```json
  {
    "content": "string (max 280 chars)",
    "mediaUrls": ["string"],
    "twitterAccountId": "string (optional, defaults to primary)",
    "publishNow": boolean
  }
  ```
- **Response**: `201 Created` with the Post object.

#### `POST /posts/schedule`
Schedule a post for a specific time.
- **Request Body**:
  ```json
  {
    "content": "string",
    "scheduledAt": "ISO8601 timestamp",
    "twitterAccountId": "string"
  }
  ```
- **Response**: `201 Created` with the ScheduledPost object.

### 3.2 Analytics

#### `GET /analytics`
Retrieve engagement metrics for a specific period.
- **Query Parameters**:
  - `start_date`: ISO8601
  - `end_date`: ISO8601
  - `twitterAccountId`: string (optional)
- **Response**:
  ```json
  {
    "summary": {
      "impressions": 124000,
      "likes": 4500,
      "retweets": 800
    },
    "dailyBreakdown": [...]
  }
  ```

### 3.3 Automation

#### `POST /automation/repost`
Configure auto-repost (viral self-retweet) settings.
- **Request Body**:
  ```json
  {
    "postId": "string",
    "thresholdType": "likes | retweets | impressions",
    "thresholdValue": number,
    "delayMinutes": number
  }
  ```

---

## 4. Data Schemas

### 4.1 Post Object
```json
{
  "id": "uuid",
  "content": "string",
  "status": "DRAFT | SCHEDULED | PUBLISHED | FAILED",
  "twitterAccountId": "string",
  "createdAt": "timestamp",
  "metrics": {
    "likes": 10,
    "retweets": 2,
    "impressions": 500
  }
}
```

---

## 5. Error Handling
Standard HTTP status codes:
- `400 Bad Request`: Validation failed.
- `401 Unauthorized`: Missing or invalid API key.
- `403 Forbidden`: Insufficient permissions for the key.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Server-side failure.

---

## 6. OpenAPI / Swagger Specification (Partial)
(A full YAML file will be provided in the repository at `/docs/api/openapi.yaml`)

```yaml
openapi: 3.0.0
info:
  title: Xboost Public API
  version: 1.0.0
paths:
  /posts:
    post:
      summary: Create a post
      security:
        - ApiKeyAuth: []
...
```

---

## 7. Success Criteria
1. API key generation and revocation work via Dashboard.
2. All specified endpoints return correct data according to the schema.
3. Rate limiting correctly throttles requests.
4. Documentation is automatically updated via OpenAPI spec.
