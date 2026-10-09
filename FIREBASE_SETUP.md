# Firebase setup

The app is configured for the `iconacademy-ddf56` Firebase project.

## 1. Enable admin authentication

1. Open Firebase Console > Authentication > Sign-in method.
2. Enable Email/Password.
3. The configured admin account is `iconadmin@mail.com` with UID `pOGN5R17jRXBAxUHHWcb2kTqn2w1`.
4. Use that account's password on `/admin`.

The app has no public sign-up screen, so accounts are created only from Firebase Console.

## 2. Publish Realtime Database rules

Open Realtime Database > Rules, paste the contents of `database.rules.json`, then click Publish.

- Events and notes are publicly readable because they appear on the public website.
- All writes require the configured admin UID.
- Fees, teacher salaries and expenses require that same admin UID for both reads and writes.

## 3. No Storage upgrade required

This project does not require Firebase Storage or a Blaze billing account. Compressed event photos and note PDFs are stored in Realtime Database. The admin limits PDFs to 4 MB so each upload remains within Realtime Database request limits.

## 4. First login and migration

On the first successful Firebase admin login:

- Existing browser records are migrated only when the matching Firebase path is empty.
- Existing event images are retained and uploaded PDFs are moved into a separate Realtime Database path.
- Seed events and notes are added when their Firebase paths are empty.
- Legacy admin records are removed from local storage only after migration succeeds.

JSON export and restore remain available as an additional manual backup.

## Optional CLI deployment

After installing Firebase CLI and signing in, the checked-in `firebase.json` and `.firebaserc` support:

```powershell
firebase deploy --only database
```
