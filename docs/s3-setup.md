# AWS S3 setup

Instructors upload course videos and cover images straight from the browser to S3 using
short-lived presigned URLs (`lib/s3.ts`, `lib/actions/uploads.ts`). Until the variables below
are filled in, the upload buttons stay hidden and instructors paste links instead.

## 1. Create the bucket

Create a bucket (for example `mlimalms-media`) in your preferred region, e.g. `af-south-1` (Cape Town).
Files are stored under `uploads/<userId>/images/` and `uploads/<userId>/videos/`.

## 2. Allow browser uploads (CORS)

Bucket → Permissions → Cross-origin resource sharing (CORS):

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## 3. Make uploads readable

Videos and images are played and shown using their public URL, so `uploads/*` must be readable.
Either:

- **Recommended:** put a CloudFront distribution in front of the bucket (Origin Access Control)
  and set `AWS_S3_PUBLIC_URL` to the CloudFront domain, or
- turn off "Block public access" for the bucket and add this bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadUploads",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mlimalms-media/uploads/*"
    }
  ]
}
```

## 4. Create an IAM user for the app

Create an IAM user with programmatic access and attach this policy, then create an access key:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::mlimalms-media/uploads/*"
    }
  ]
}
```

## 5. Fill in `.env`

```
AWS_REGION=af-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=mlimalms-media
AWS_S3_PUBLIC_URL=            # optional, e.g. https://d123.cloudfront.net
```

Restart the dev server. The **Upload** buttons appear next to the cover image and lesson video fields.

Limits are in `lib/upload-rules.ts`: images up to 5 MB (jpg, png, webp, gif), videos up to 2 GB
(mp4, webm, mov). Uploaded files are deleted from S3 when the lesson or course is deleted, or when
a cover image is replaced.
