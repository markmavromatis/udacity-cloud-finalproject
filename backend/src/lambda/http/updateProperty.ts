import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateUpdatePropertyRequest } from '../../requests/CreateUpdatePropertyRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { updateProperty } from "../../businessLogic/properties"
import { createLogger } from '../../utils/logger'

const logger = createLogger("GenerateUploadUrl")

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const requestId = event.requestContext.requestId

  logger.info(`${requestId} Entering UpdateProperty service...`)

  const propertyId = event.pathParameters.propertyId
  logger.info(`${requestId} Updated Property record: ${propertyId}`)

  const updatedProperty: CreateUpdatePropertyRequest = JSON.parse(event.body)
  logger.info(`${requestId} Updated fields: ${JSON.stringify(updatedProperty)}`)

  updateProperty(propertyId, updatedProperty)
  logger.info("${requestId} Update complete!")

  logger.info("${requestId} Exiting with status code 200")

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
})

handler
  .use(cors({credentials: true}))

