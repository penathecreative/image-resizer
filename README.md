# AWS Lambda Image Resizer

A serverless function that automatically resizes images uploaded to an S3 bucket. When an image is uploaded to the `original-images/` folder, this Lambda function creates a resized version (300x300) in the `resized-images/` folder.

## Features

- Automatic image resizing on S3 upload
- Maintains original image aspect ratio
- Processes images up to 300x300 pixels
- Preserves original content type
- Error handling and logging

## Prerequisites

- AWS Account
- AWS CLI configured
- Node.js installed
- S3 bucket with appropriate permissions

## Dependencies

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^latest",
    "sharp": "^latest"
  }
}
```

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

The function uses the following constants:
```javascript
const ORIGINAL_PREFIX = "original-images/";
const RESIZED_PREFIX = "resized-images/";
```

S3 bucket structure:
```
your-bucket/
├── original-images/    # Upload original images here
└── resized-images/    # Resized images appear here
```

## S3 Trigger Setup

1. Create an S3 bucket trigger for your Lambda function
2. Configure the trigger to respond to `ObjectCreated` events
3. Set the prefix filter to `original-images/`

## IAM Permissions

The Lambda function requires these S3 permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/original-images/*",
        "arn:aws:s3:::your-bucket-name/resized-images/*"
      ]
    }
  ]
}
```

## Usage

1. Upload an image to the `original-images/` folder in your S3 bucket
2. The Lambda function automatically triggers
3. A resized version appears in the `resized-images/` folder

## Response Format

Success response:
```json
{
  "statusCode": 200,
  "body": {
    "message": "Image resized and uploaded successfully!",
    "resizedKey": "resized-images/your-image.jpg"
  }
}
```

Error response:
```json
{
  "statusCode": 500,
  "body": {
    "message": "Failed to resize image",
    "error": "Error details..."
  }
}
```

## Error Handling

The function includes error handling for:
- Invalid file locations
- Image processing failures
- S3 operation failures

## Deployment

```bash
# Zip the function and dependencies
zip -r function.zip .

# Deploy to AWS Lambda
aws lambda update-function-code \
  --function-name YOUR_FUNCTION_NAME \
  --zip-file fileb://function.zip
```
