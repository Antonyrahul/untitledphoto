import { S3Client } from "@aws-sdk/client-s3";
import { FetchHttpHandler } from "@smithy/fetch-http-handler";

const s3Client = new S3Client({
  requestHandler: new FetchHttpHandler({ keepAlive: false }),
  region: process.env.S3_UPLOAD_REGION!,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY!,
    secretAccessKey: process.env.S3_UPLOAD_SECRET!,
  },
});

export default s3Client;
