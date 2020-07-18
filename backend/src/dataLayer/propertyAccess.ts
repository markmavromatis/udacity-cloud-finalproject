import * as AWS from 'aws-sdk'
import {PropertyItem} from "../models/PropertyItem"
const docClient = new AWS.DynamoDB.DocumentClient()
const propertiesTable = process.env.PROPERTIES_TABLE
const propertyUserIdIndex = process.env.USER_ID_INDEX
const bucketName = process.env.PROPERTY_IMAGES_S3_BUCKET

// DynamoDb logic for Properties App operations
export class PropertyAccess {

  async createProperty(property: PropertyItem): Promise<PropertyItem> {
    await docClient.put({
      TableName: propertiesTable,
      Item: property
    }).promise()
  
    return property
  }

  async getProperties(userId: string): Promise<PropertyItem[]> {
    const result = await docClient.query({
        TableName : propertiesTable,
        IndexName : propertyUserIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    // print("Result items = " + JSON.stringify(result.Items))
    return result.Items ? result.Items as PropertyItem[]: [] as PropertyItem[];
  }

  async deleteProperty(propertyId: string) {
    await docClient.delete({
      TableName: propertiesTable,
      Key:{
        "propertyId": propertyId
      }
    }).promise()
  }

  async updateProperty(propertyId: string, address: string, neighborhood: string, price: number, fees: number, tax: number) {
    await docClient.update({
      TableName: propertiesTable,
      Key:{
        "propertyId": propertyId
      },
      UpdateExpression: "set address=:address, neighborhood=:neighborhood, price=:price, fees=:fees, tax=:tax",
      ExpressionAttributeValues:{
          ":address": address,
          ":neighborhood": neighborhood,
          ":price": price,
          ":fees": fees,
          ":tax": tax
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()
  }

  // Update the url field in the DynamoDB Properties table
  async updateUrl(propertyId : String) {

    const attachmentUrl: string = 'https://' + bucketName + '.s3.amazonaws.com/' + propertyId
    const options = {
                  TableName: propertiesTable,
                  Key: {
                      propertyId: propertyId
                  },
                  UpdateExpression: "set attachmentUrl = :url",
                  ExpressionAttributeValues: {
                      ":url": attachmentUrl
                  },
                  ReturnValues: "UPDATED_NEW"
              };
    await docClient.update(options).promise()    
  }

}