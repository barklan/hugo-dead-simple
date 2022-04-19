---
title: "Some REST API Guidelines"
date: "2022-04-17"
categories:
  - Backend
tags:
  - REST API
toc: true
---

This is a shortened merge of [Google's API design guide](https://cloud.google.com/apis/design)
and [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md).

To write OpenAPI schema [swagger](https://swagger.io/docs/specification/basic-structure/) documentation is useful.
To quickly iterate on a design, [semantic versioning](https://semver.org/) should be used.
To generate human-readable diff of different versions [openapi-diff](https://github.com/OpenAPITools/openapi-diff)
can be useful.

## 1. Resource-oriented design

In general URL paths should follow this scheme:

| API Service Name | Collection ID | Resource ID | Collection ID | Resource ID |
|---|---|---|---|---|
| //storage.googleapis.com | /buckets | /bucket-id | /objects | /object-id |

A storage service has a collection of `buckets`, where each bucket has a collection of `objects`.

Another example:

```http
https://api.contoso.com/v1.0/people/7011042402/inbox
```

Resource names should be **noun** and not verb. Resource names should be **plural**.

## 2. Naming and standards

Microsoft mostly uses *camelCase*, Google mostly uses *snake_case* - this guide will be using **camelCase**.

- Acronyms should follow the casing conventions as though they were regular words (e.g. `Url`).
- All identifiers including namespaces, entityTypes, entitySets, properties, actions, functions and enumeration values should use lowerCamelCase.
- HTTP headers are the exception and should use standard HTTP convention of Capitalized-Hyphenated-Terms.
- Full words should be preferred (e.g. `message` instead of `msg`).

Common property names should be used where applicable:

| Name | Type | Description |
|---|---|---|
| name |	string |	The name field should contain the relative resource name. |
| parent |	string |	For resource definitions and List/Create requests, the parent field should contain the parent relative resource name. |
| createTime |	Timestamp |	The creation timestamp of an entity. |
| updateTime |	Timestamp |	The last update timestamp of an entity. Note: update_time is updated when create/patch/delete operation is performed. |
| deleteTime |	Timestamp |	The deletion timestamp of an entity, only if it supports retention. |
| expireTime |	Timestamp |	The expiration timestamp of an entity if it happens to expire. |
| startTime |	Timestamp |	The timestamp marking the beginning of some time period. |
| endTime |	Timestamp |	The timestamp marking the end of some time period or operation (regardless of its success). |
| readTime |	Timestamp |	The timestamp at which a particular an entity should be read (if used in a request) or was read (if used in a response). |
| timeZone |	string |	The time zone name. It should be an IANA TZ name, such as "America/Los_Angeles". For more information, see [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). |
| regionCode |	string |	The Unicode country/region code (CLDR) of a location, such as "US" and "419". For more information, see [unicode.org](http://www.unicode.org/reports/tr35/#unicode_region_subtag). |
| languageCode |	string |	The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see [unicode.org](http://www.unicode.org/reports/tr35/#Unicode_locale_identifier). |
| mimeType |	string |	An IANA published MIME type (also referred to as media type). For more information, see [iana.org](https://www.iana.org/assignments/media-types/media-types.xhtml). |
| displayName |	string |	The display name of an entity. |
| title |	string |	The official name of an entity, such as company name. It should be treated as the formal version of display_name. |
| description |	string |	One or more paragraphs of text description of an entity. |
| filter |	string |	The standard filter parameter for List methods. See AIP-160. |
| query |	string |	The same as filter if being applied to a search method (ie :search) |
| pageToken |	string |	The pagination token in the List request. |
| pageSize |	int32 |	The pagination size in the List request. |
| totalSize |	int32 |	The total count of items in the list irrespective of pagination. |
| nextPageToken |	string |	The next pagination token in the List response. It should be used as page_token for the following request. An empty value means no more result. |
| orderBy |	string |	Specifies the result ordering for List requests. |
| progressPercent |	int32 |	Specifies the progress of an action in percentage (0-100). The value -1 means the progress is unknown. |
| requestId |	string |	A unique string id used for detecting duplicated requests. |
| validateOnly |	bool |	If true, it indicates that the given request should only be validated, not executed. |
| id | string | See [Canonical identifier](#canonical-identifier) section. |
| location | string | Opaque URL for some resource. |
| message | string | Arbitrary message. |

For resource fields that cannot be set by the clients, they must be documented as "Output only" fields.

### Canonical identifier

In addition to friendly URLs, resources that can be moved or be renamed SHOULD expose a URL that contains a unique stable identifier. It MAY be necessary to interact with the service to obtain a stable URL from the friendly name for the resource, as in the case of the `/my` shortcut used by some services.

One option is to use [ULID](https://github.com/ulid/spec).

### Time

All time values are should be represented as RFC 3339 timestamps:

```txt
2019-10-12T07:20:50.52Z      (UTC+0)
2019-10-12T07:20:50.52+00:00 (UTC+0)
2019-10-12T14:20:50.52+07:00 (UTC+7)
2019-10-12T03:20:50.52-04:00 (UTC-4)
```

### Durations

Durations need to be serialized in conformance with ISO 8601 with the following format:

```txt
P[n]Y[n]M[n]DT[n]H[n]M[n]S
```

Example (3 years, 6 months, 4 days, 12 hours, 30 minutes, and 5 seconds):

```txt
P3Y6M4DT12H30M5S
```

### Intervals

Intervals are defined as part of ISO 8601. It seems sufficient to support only the following formats:

- Start and end, such as

  ```txt
  2007-03-01T13:00:00Z/2008-05-11T15:30:00Z
  ```

- Start and duration, such as

  ```txt
  2007-03-01T13:00:00Z/P1Y2M10DT2H30M
  ```

## 3. HTTP Methods

| Method | HTTP Request Body | HTTP Response Body | Is Idempotent | Description |
|---|---|---|---|---|
| GET <collection URL> | N/A | Resource list | True | Return the specified resource. |
| GET <resource URL> | N/A | Resource | True | Return a list of resources. |
| POST <collection URL> | Resource | Resource | False | Create a new object, or submit a command. |
| PUT <resource URL> | Resource | Resource | True | Replace an object. |
| PATCH <resource URL> | Resource | Resource | False | Apply a partial update to an object. |
| DELETE <resource URL> | N/A | ... | True |Delete an object. |
| HEAD | N/A | ... | True | Return metadata of an object for a GET response. |

## 4. Headers

A good reference for standard headers can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).
The most common are listed below.

### Standard request headers

| Header | Description | Examples |
|---|---|---|
| Authorization | Authorization header for the request. | `Authorization: Bearer <token>` |
| Date | Timestamp of the request in client time. | `Date: Wed, 21 Oct 2015 07:28:00 GMT`<sup id="date-header">[[1]](#date-header-ref)</sup> |
| Accept | The requested content type for the response. | `Accept: application/json` |
| Content-Type | Media type of the resource. | `Content-Type: text/html; charset=UTF-8`, `Content-Type: multipart/form-data; boundary=something` |
| If-None-Match | See [ETags](#etags) section | `If-None-Match: "686897696a7c876b7e"` |

### Standard response headers

| Response Header | Description | Examples |
|---|---|---|
| Date | Timestamp of the response in server time. | `Date: Wed, 21 Oct 2015 07:28:00 GMT` |
| Content-Type | Media type of the resource. |  `Content-Type: application/json`|
| Content-Encoding | Lists any encodings that have been applied to the representation, and in what order. | `Content-Encoding: deflate, gzip` |
| ETag | See [ETags](#etags) section. | `ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"` |

## 5. Status codes

Full list of HTTP status codes can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
The most common are listed below.

| Code | Description |
|---|---|
| 200 OK | The request succeeded. |
| 201 Created | The request succeeded, and a new resource was created as a result. |
| 202 Accepted | The request was accepted for processing, but the processing has not been completed. |
| 304 Not Modified | Indicates that the resource has not been modified (see Etags section).|
| 400 Bad Request | The server cannot or will not process the request due to something that is perceived to be a client error |
| 401 Unauthorized | The request requires user authentication. |
| 403 Forbidden | The client does not have access rights to the content. |
| 404 Not Found | A specified resource is not found. |
| 405 Method Not Allowed | The request method is known by the server but is not supported by the target resource. |
| 409 Conflict | This response is sent when a request conflicts with the current state of the server. |
| 429 Too Many Requests | The user has sent too many requests in a given amount of time ("rate limiting"). |
| 500 Internal Server Error | The server has encountered a situation it does not know how to handle. |
| 502 Bad Gateway | This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response. |
| 503 Service Unavailable | The server is not ready to handle the request. |

## 6. JSON body

### Success

To separate actual data from metadata (lake pagination, etc), the JSON body
of response should put data object under `value` key.

```json
{
  "value": [
    { "street": "1st Avenue", "city": "Seattle" },
    { "street": "124th Ave NE", "city": "Redmond" }
  ]
}
```

### Error

Error object should be under `error` key. Response body should use the following structure:

```json
{
  "error": {
    "code": "BadArgument",
    "message": "Multiple errors in ContactInfo data",
    "target": "ContactInfo",
    "details": [
      {
        "code": "NullValue",
        "target": "PhoneNumber",
        "message": "Phone number must not be null"
      },
      {
        "code": "NullValue",
        "target": "LastName",
        "message": "Last name must not be null"
      },
      {
        "code": "MalformedValue",
        "target": "Address",
        "message": "Address is not valid"
      }
    ]
  }
}
```

`code`, `message` and `details` (can be empty array) are required fields.

Note, that `message` fields are not to be used to display to client. Instead client and server
should design a set of error codes specified by `code` field (that does not nececcerily match
HTTP status codes).

## 7. Common patterns

### Pagination

All APIs that return lists should support pagination. **Client-driven paging** seems to be the most popular.

Clients MAY use `$top` and `$skip` query parameters to specify a number of results to return and an offset into the collection.
When both `$top` and `$skip` are given by a client, the server SHOULD first apply `$skip` and then `$top` on the collection.

```http
GET http://api.contoso.com/v1.0/people?$top=5&$skip=2
```

*For server-driven paging, [Google's guide](https://cloud.google.com/apis/design/design_patterns) is useful.*

### Sorting

Sorting is defined by a query parameter `$orderBy`.

The string value should follow SQL syntax: comma separated list of fields.
For example: `foo,bar`. The default sorting order is ascending.
To specify descending order for a field, a suffix `desc` should be appended to the field name.
For example: `foo desc,bar`.

### Filtering

`$filter` query parameter is evaluated for each resource in the collection, and only items where the expression evaluates to true are included in the response.

**Example 1**: return all Products whose Price is less than $10.00:

```http
GET https://api.contoso.com/v1.0/products?$filter=price lt 10.00
```

**Example 2**: all products with the name 'Milk' that also have a price less than 2.55:

```http
GET https://api.contoso.com/v1.0/products?$filter=name eq 'Milk' and price lt 2.55
```

The value of the `$filter` option is a Boolean expression.

Microsoft lists the set of operations filter should support:

| Operator | Description | Example |
|---|---|---|
| Comparison Operators | | |
| eq |	Equal |	city eq 'Redmond' |
| ne |	Not equal |	city ne 'London' |
| gt |	Greater than |	price gt 20 |
| ge |	Greater than or equal |	price ge 10 |
| lt |	Less than |	price lt 20 |
| le |	Less than or equal |	price le 100 |
| Logical Operators | | |
| and |	Logical and |	price le 200 and price gt 3.5 |
| or |	Logical or |	price le 3.5 or price gt 200 |
| not |	Logical negation |	not price le 3.5 |
| Grouping Operators | | |
| () | Precedence grouping | (priority eq 1 or city eq 'Redmond') and price gt 100 |

For more examples and operator precedence look
at [Microsoft's guide](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#97-filtering).

**When a filter is performed on a collection and the result set is empty you must respond with a valid response body and a 200 response code.**

### Long Running Operations

Services should be as responsive as possible, so as not to block callers. As a rule of thumb any API call that is expected to take longer than 0.5 seconds in the 99th percentile, should consider using the following Long-running Operations pattern for those calls.

The operation resource must be returned directly as the response message and
any immediate consequence of the operation should be reflected in the API.
For example, when creating a resource, that resource should appear in GET method
though the resource should indicate that it is not ready for use.
When the operation is complete, the `value` field should
contain the value that would have been returned directly,
if the method was not long running.

### Access Sub-Collections

Sometimes, an API needs to let a client search across sub- collections. For example, the Library API has a collection of shelves, and each shelf has a collection of books, and a client wants to search for a book across all shelves.

```http
GET https://library.googleapis.com/v1/shelves/-/books?filter=xxx
GET https://library.googleapis.com/v1/shelves/-/books/{id}
```

### ETags

In typical usage, when a URL is retrieved, the Web server will return the resource's current representation along with its corresponding ETag value, which is placed in an HTTP response header "ETag" field:

```txt
ETag: "686897696a7c876b7e"
```

The client may then decide to cache the representation, along with its ETag. Later, if the client wants to retrieve the same URL resource again, it will first determine whether the locally cached version of the URL has expired (through the Cache-Control and the Expire headers). If the URL has not expired, it will retrieve the locally cached resource. If it is determined that the URL has expired (is stale), the client will send a request to the server that includes its previously saved copy of the ETag in the "If-None-Match" field.

```txt
If-None-Match: "686897696a7c876b7e"
```

On this subsequent request, the server may now compare the client's ETag with the ETag for the current version of the resource. If the ETag values match, meaning that the resource has not changed, the server may send back a very short response with a HTTP 304 Not Modified status. The 304 status tells the client that its cached version is still good and that it should use that.

### Throttling

Services should be as responsive as possible, so as not to block callers. As a rule of thumb any API call that is expected to take longer than 0.5 seconds in the 99th percentile, should consider using the Long-running Operations pattern for those calls.

HTTP specifies two return codes for these scenarios: '429 Too Many Requests' and '503 Service Unavailable'. Services should use 429 for cases where clients are making too many calls and can fix the situation by changing their call pattern. Services should respond with 503 in cases where general load or other problems outside the control of the individual callers is responsible for the service becoming slow.

To avoid cascading failures, [Circuit Breaker pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
can be used ([Go implementation](https://github.com/sony/gobreaker)).

## Notes

- <small id="date-header-ref">[[1]](#date-header) The time format in `Date` header [is important](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date).
</small>
