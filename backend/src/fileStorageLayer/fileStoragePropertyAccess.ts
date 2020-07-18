import * as AWS  from 'aws-sdk'

const bucketName = process.env.PROPERTY_IMAGES_S3_BUCKET
const urlExpires = process.env.GENERATED_URL_EXPIRATION

export class FileLayerPropertyAccess {
    
  getSignedUrl(propertyId : string) {
    const s3 = new AWS.S3({signatureVersion: 'v4'})
  
    console.log("Generating URL for uploading image attachment to Property: " + propertyId)
  
    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: propertyId,
      Expires: parseInt(urlExpires)
    })
    return url
  }
}