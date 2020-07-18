import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {getUserIdFromAuthorizationHeader} from "../../auth/utils"
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateUpdatePropertyRequest } from '../../requests/CreateUpdatePropertyRequest'

import { createLogger } from '../../utils/logger'
import { createProperty } from "../../businessLogic/properties"

const logger = createLogger("CreateProperty")

// This service creates a new Property item
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const requestId = event.requestContext.requestId

    logger.info(`${requestId} Entering CreateProperty service...`)

    const newProperty: CreateUpdatePropertyRequest = JSON.parse(event.body)
    logger.info(`${requestId} Creating new Property item: ${JSON.stringify(newProperty)}`)

    // Retrieve User ID from Authorization header
    const userId = getUserIdFromAuthorizationHeader(event);

    logger.info(`${requestId} UserID: ${userId}`)
    const propertyRequestFields : CreateUpdatePropertyRequest = JSON.parse(event.body);

    logger.info(`${requestId} Creating new record in database...`)
    const newItem = await createProperty(propertyRequestFields, userId)
    logger.info(`${requestId} Record added!`)

    logger.info(`${requestId} Exiting with status code 201...`)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
})

handler
  .use(cors({credentials: true}))
