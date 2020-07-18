import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { generateUploadUrl } from "../../businessLogic/properties"

import { createLogger } from '../../utils/logger'

const logger = createLogger("GenerateUploadUrl")

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const requestId = event.requestContext.requestId

  logger.info(`${requestId} Entering GenerateUploadUrl service...`)

  const propertyId = event.pathParameters.propertyId

  logger.info(`${requestId} Generating URL for property with ID: ${propertyId}`)

  const url = await generateUploadUrl(propertyId);

  logger.info(`${requestId} Retrieved temporary URL: ${url}`)

  logger.info("${requestId} Exiting with status code 200...")

  return {
    statusCode: 200,
    body: JSON.stringify({"uploadUrl": url})
  }

})

handler
  .use(cors({credentials: true}))


