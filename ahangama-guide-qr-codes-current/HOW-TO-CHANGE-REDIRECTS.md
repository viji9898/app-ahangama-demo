# How to change a QR code redirect

This clean current batch is controlled by the existing redirect mapping:

src/data/guideQrRedirectsTasklist.js

The printed QR codes encode permanent URLs:

https://ahangama.com/go/<slug>

The printed URL never changes. To move a QR code to a new page, change only its
destination.

## Change an existing destination

1. Open src/data/guideQrRedirectsTasklist.js.
2. Find the entry by its slug.
3. Edit only the destination value.
4. Keep slug, section, codeId and file exactly as they are.
5. Run the checks and rebuild.

## Provisional destinations

Six entries are provisional: transport-google-form and
continue-route-1 ... continue-route-5. See MISSING-DESTINATIONS.md.
