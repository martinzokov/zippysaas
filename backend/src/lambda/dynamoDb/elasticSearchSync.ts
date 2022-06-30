import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support/register";
import * as elasticsearch from "elasticsearch";
import * as httpAwsEs from "http-aws-es";
import { createLogger } from "../../utils/logger";

const esHost = process.env.ES_ENDPOINT;

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs,
});

const logger = createLogger("searchIndexSyncer");

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  logger.info("Processing events batch from DynamoDB", JSON.stringify(event));

  for (const record of event.Records) {
    logger.info("Processing record", JSON.stringify(record));
    try {
      if (record.eventName == "INSERT") {
        await newIndexItem(record);
      }
      if (record.eventName == "MODIFY") {
        await updateIndexItem(record);
      }
      if (record.eventName == "REMOVE") {
        await removeIndexedItem(record);
      }
    } catch (error) {
      logger.error(error);
    }
  }
};

const newIndexItem = async (record: any) => {
  const newItem = record.dynamodb.NewImage;

  const itemId = newItem.partitionKey.S;

  const body = {
    partitionKey: newItem.partitionKey.S,
    sortKey: newItem.sortKey.S,
    recipeName: newItem.recipeName.S,
    description: newItem.description.S,
    ingridients: newItem.ingridients.L,
  };
  await es
    .index({
      index: "recipes-index",
      type: "recipes",
      id: itemId,
      body,
    })
    .then((data) => console.log("index op ", data));
};

const updateIndexItem = async (record: any) => {
  const newItem = record.dynamodb.NewImage;

  const itemId = newItem.partitionKey.S;

  const body = {
    partitionKey: newItem.partitionKey.S,
    sortKey: newItem.sortKey.S,
    recipeName: newItem.recipeName.S,
    description: newItem.description.S,
    ingridients: newItem.ingridients.L,
  };

  await es.update({
    index: "recipes-index",
    type: "recipes",
    id: itemId,
    body,
  });
};

const removeIndexedItem = async (record: any) => {
  const deletedItemKeys = record.dynamodb.Keys;

  const itemKey = deletedItemKeys.partitionKey.S;

  await es.delete({
    index: "recipes-index",
    type: "recipes",
    id: itemKey,
  });
};
