# Contact configuration

Edit only `config/site.json`:

```json
{
  "contact": {
    "facebookPageUrl": "https://www.facebook.com/your-page",
    "supportEmail": "support@example.com",
    "whatsappNumber": "+8801700000000",
    "whatsappPrefilledMessage": "Hello, I need help regarding the Moner Kotha website."
  }
}
```

Rules:

- Facebook must be an `http` or `https` URL; production should use HTTPS.
- Email is validated before a `mailto:` link is created.
- WhatsApp is sanitised to E.164-compatible digits before creating `https://wa.me/NUMBER`.
- Empty or invalid values remain visibly disabled as “Coming soon”; no broken link is emitted.
- These are platform support contacts, not crisis hotlines.
- Re-run `py tools/generate_static_site.py` after editing contact values so public-page initial HTML and structured data are regenerated.
