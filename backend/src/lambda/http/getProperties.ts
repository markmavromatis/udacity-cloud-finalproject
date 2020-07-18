import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as AWS  from 'aws-sdk'
import {getUserIdFromAuthorizationHeader} from "../../auth/utils"
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

// const docClient = new AWS.DynamoDB.DocumentClient()

import { getProperties } from "../../businessLogic/properties"
import { createLogger } from '../../utils/logger'

const logger = createLogger("GenerateUploadUrl")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const requestId = event.requestContext.requestId

  logger.info(`${requestId} Entering GetProperties service...`)

  // Retrieve User ID from Authorization header
  const userId = getUserIdFromAuthorizationHeader(event);
  logger.info(`${requestId} Retrieving Properties for User ID: ${userId}`)

  const returnResult = await getProperties(userId);
  logger.info(`${requestId} Found ${returnResult.length} records!`)
  logger.info(`${requestId} Exiting with status code 200...`)

  // Return results (if there are any).
  return {
    statusCode: 200,
    body: JSON.stringify({items: returnResult})
  }

})

handler
  .use(cors({credentials: true}))

