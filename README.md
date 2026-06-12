# NEFF course project

## Local start

The application uses JSON Server for all CRUD operations.

```powershell
npx json-server db.json --port 3000
python -m http.server 8012 --bind 127.0.0.1
```

Open `http://127.0.0.1:8012/index.html`.

## Test accounts

- Administrator: `starlightsfaq708@gmail.com` / `As07051977*`
- Client: `maria.ivanova@example.com` / `Maria2025!`

After authentication, both roles are redirected to `dashboard.html`.

## Role capabilities

- Administrator: full CRUD for products, users, and orders.
- Client: profile editing, favorites, cart management, order creation, viewing, and cancellation.
