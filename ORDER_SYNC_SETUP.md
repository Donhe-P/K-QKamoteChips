# Shared Order Sync Setup

The app can save orders in two ways:

1. Browser storage: works only on the same device/browser.
2. Shared Order API URL: required for customer orders from other phones/devices to appear in Admin.

## API Contract

Set the shared endpoint with `REACT_APP_ORDER_API_URL` before building/deploying, or paste it in Admin > Shared Order Sync.

The app sends `POST` requests with `Content-Type: text/plain;charset=utf-8` and a JSON body.

List orders:

```json
{ "action": "list" }
```

Add order:

```json
{ "action": "add", "order": { "orderNumber": "KQ-260512-1234" } }
```

Update status:

```json
{ "action": "updateStatus", "orderNumber": "KQ-260512-1234", "status": "Confirmed" }
```

Delete order:

```json
{ "action": "delete", "orderNumber": "KQ-260512-1234" }
```

Every response should return:

```json
{ "orders": [] }
```

The endpoint must allow browser requests from your website domain.
