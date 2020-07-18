import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteProperty } from "../../businessLogic/properties"
import { createLogger } from '../../utils/logger'

const logger = createLogger("DeleteProperty")

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const requestId = event.requestContext.requestId

  logger.info(`${requestId} Entering DeleteProperty service...`)

  const propertyId = event.pathParameters.propertyId
  logger.info(`${requestId} Deleting Property record: ${propertyId}`)

  await deleteProperty(propertyId)

  logger.info(`${requestId} Exiting with status code 200...`)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }

})

handler
  .use(cors({credentials: true}))

