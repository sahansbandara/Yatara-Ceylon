# WhatsApp Integration

## Purpose

The dashboard now exposes a protected WhatsApp concierge shortcut for staff and admins from the booking detail page.

## Required Environment Variables

- `WHATSAPP_NUMBER`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

Set at least one of the variables above to the business WhatsApp number in international format without `+`.

Example:

```env
WHATSAPP_NUMBER=94701234567
```

## Operator Workflow

1. Open a booking in the dashboard.
2. Find the `WhatsApp Concierge` card in the right-hand sidebar.
3. Click `Open WhatsApp` to launch a prefilled message with booking context.
4. Review the message before sending.

## Safety / Fallback

- If no WhatsApp number is configured, the card stays visible but shows a non-destructive setup message instead of a broken link.
- The shortcut is generated server-side via `GET /api/bookings/[id]/whatsapp`.
- Public site WhatsApp CTAs remain unchanged; this flow is specifically for operator dispatch.
