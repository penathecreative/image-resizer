# Lambda Image Resizer

A Node.js AWS Lambda function that automatically resizes images uploaded to S3.

## Setup

1. Create an AWS Lambda function
2. Set up an S3 bucket trigger
3. Configure environment variables in Lambda:
   ```
   S3_BUCKET=your-bucket-name
   ```

## Installation

```bash
npm install
```

## Local Development

1. Install dependencies
2. Create `.env` file with required variables
3. Run tests: `npm test`

## Deployment

Deploy to AWS Lambda using:

```bash
npm run deploy
```

## Configuration

The function processes images with the following settings:
- Max width: 800px
- Supported formats: JPG, PNG
- Output format: JPG
- Quality: 80%

## File Structure

```
├── src/
│   ├── index.js          # Main Lambda handler
│   └── imageProcessor.js # Image processing logic
├── tests/
├── package.json
└── README.md
```
