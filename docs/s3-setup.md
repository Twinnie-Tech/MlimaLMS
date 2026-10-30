# AWS S3 setup

Instructors upload course cover images (and lesson videos) straight from the browser to S3 using
short-lived presigned URLs (`lib/s3.ts`, `lib/actions/uploads.ts`). Until the variables below are
filled in, the cover image drop zone is disabled and instructors paste links instead.

How it works:

1. The instructor drops an image on the drop zone (`components/file-uploader/uploader.tsx`).
2. The `createUploadUrl` server action checks the user, the Arcjet rate limit, the file type and
   size, and returns a presigned `PUT` URL valid for 10 minutes.
3. The browser uploads the file directly to S3 and shows progress. Nothing passes through our server.
4. The public URL is saved on the course as `imageUrl`.

Files are stored as:

```
<bucket>/
└── uploads/
    └── <userId>/
        ├── images/<uuid>.jpg|png|webp|gif   (cover images, up to 5 MB)
        └── videos/<uuid>.mp4|webm|mov       (lesson videos, up to 2 GB)
```

Limits live in `lib/upload-rules.ts`. A replaced cover image, or a deleted course or lesson,
removes its file from S3.

## 1. Create an IAM user (one time, in the AWS console)

IAM → Users → **Create user**, for example `mlimalms-app`. Do not give it console access.
Attach an inline policy with the JSON below, replacing `mlimalms-media` with your bucket name.
It only works on that one bucket: the first statement lets `pnpm s3:setup` create and configure
the bucket, the second lets the app upload, read and delete files.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ManageBucket",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:ListBucket",
        "s3:PutBucketCORS",
        "s3:PutBucketPolicy",
        "s3:PutBucketPublicAccessBlock"
      ],
      "Resource": "arn:aws:s3:::mlimalms-media"
    },
    {
      "Sid": "ManageUploads",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::mlimalms-media/uploads/*"
    }
  ]
}
```

Then open the user → Security credentials → **Create access key** → "Application running
outside AWS". Copy the access key ID and secret.

If your account has **Block Public Access** turned on at the account level (S3 → Block Public
Access settings for this account), turn off the two "bucket policies" options there, otherwise
cover images cannot be shown publicly.

## 2. Fill in `.env`

```
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=mlimalms-media
AWS_S3_PUBLIC_URL=
```

- **Region:** `eu-west-1` (Ireland) works on every account. `af-south-1` (Cape Town) is closer
  to Kenya but must first be enabled under Account → AWS Regions.
- **Bucket name:** must be unique across all of AWS. If `mlimalms-media` is taken, add a suffix.
- **AWS_S3_PUBLIC_URL:** leave empty to serve files from the bucket URL. Set it to a CloudFront
  domain (for example `https://d123.cloudfront.net`) if you add a CDN later.

## 3. Run the setup script

```
pnpm s3:setup
```

It creates the bucket if needed, allows public reads for `uploads/*` only, adds CORS for
`http://localhost:3000` and your `BETTER_AUTH_URL`, then uploads a test file through a
presigned URL, reads it back from the public URL and deletes it. Run it again any time; it is
safe to repeat. To add more browser origins (for example a Vercel preview domain):

```
$env:S3_CORS_ORIGINS="https://mlimalms.vercel.app"; pnpm s3:setup
```

`pnpm s3:check` runs only the upload and read test.

The dev server picks up the new `.env` values on its own. Open **Instructor → New course** and
drop an image on the cover image zone.

## 4. Production (Vercel)

Add the same five `AWS_*` variables under Project → Settings → Environment Variables, then run
`pnpm s3:setup` once more with `BETTER_AUTH_URL` (or `S3_CORS_ORIGINS`) set to your production
domain so the browser is allowed to upload from it. Redeploy.
