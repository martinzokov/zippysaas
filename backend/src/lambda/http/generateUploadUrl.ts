import "source-map-support/register";
import * as uuid from "uuid";
import * as AWS from "aws-sdk";

import * as AWSXRay from "aws-xray-sdk";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("imageUrlGenerator");

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: "v4",
});

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const fileType = event.queryStringParameters.fileType;
  const userId = getUserId(event);

  const imageId = uuid.v4();

  const imgUrl = await createImage(userId, imageId, fileType);
  const uploadUrl = getUploadUrl(imageId, fileType);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      uploadUrl,
      imgUrl,
    }),
  };
};

async function createImage(userId: string, imageId: string, fileType: string) {
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;

  return imageUrl;
}

function getUploadUrl(imageId: string, fileType: string) {
  try {
    return s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: `${imageId}`,
      Expires: urlExpiration,
    });
  } catch (error) {
    logger.error(error);
  }
}
