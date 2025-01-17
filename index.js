const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");

// Initialize S3Client with the region
const s3Client = new S3Client({ region: "eu-central-1" });

// Define configurable S3 prefixes
const ORIGINAL_PREFIX = "original-images/";
const RESIZED_PREFIX = "resized-images/";

exports.handler = async (event) => {
  try {
    // Log the incoming event
    console.log("Event received:", JSON.stringify(event, null, 2));

    // Extract bucket name and object key from the event
    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    console.log(`Bucket: ${bucketName}, Key: ${objectKey}`);

    // Ensure the key starts with the expected prefix
    if (!objectKey.startsWith(ORIGINAL_PREFIX)) {
      console.warn(
        `Skipping object not in ${ORIGINAL_PREFIX} folder: ${objectKey}`
      );
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Object is not in the ${ORIGINAL_PREFIX} folder.`,
        }),
      };
    }

    // Get the original image from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const originalImageResponse = await s3Client.send(getObjectCommand);

    // Read the image data as a stream and buffer it
    const chunks = [];
    for await (const chunk of originalImageResponse.Body) {
      chunks.push(chunk);
    }
    const originalImage = Buffer.concat(chunks);

    console.log("Original image retrieved successfully.");

    // Resize the image
    const resizedImage = await sharp(originalImage)
      .resize(300, 300) // Resize to 300x300
      .toBuffer();

    console.log("Image resized successfully.");

    // Define the new key for the resized image
    const resizedKey = objectKey.replace(ORIGINAL_PREFIX, RESIZED_PREFIX);

    // Upload the resized image to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: resizedKey,
      Body: resizedImage,
      ContentType: originalImageResponse.ContentType,
    });
    await s3Client.send(putObjectCommand);

    console.log(`Resized image uploaded to ${resizedKey}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Image resized and uploaded successfully!",
        resizedKey: resizedKey,
      }),
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to resize image", error }),
    };
  }
};
