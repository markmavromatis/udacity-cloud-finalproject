import * as uuid from 'uuid'

import { PropertyItem } from '../models/PropertyItem'
import { PropertyAccess } from '../dataLayer/propertyAccess'
import { FileLayerPropertyAccess } from '../fileStorageLayer/fileStoragePropertyAccess'
import { CreateUpdatePropertyRequest } from '../requests/CreateUpdatePropertyRequest'

const propertyAccess = new PropertyAccess()
const fileLayerAccess = new FileLayerPropertyAccess()

// Business logic for creating a Property item
export async function createProperty(
  propertyRequest: CreateUpdatePropertyRequest,
  userId: string): Promise<PropertyItem> {

  const itemId = uuid.v4()
  const newProperty : PropertyItem = {
      propertyId: itemId,
      userId: userId,
      address: propertyRequest.address,
      neighborhood: propertyRequest.neighborhood,
      price: propertyRequest.price,
      fees: propertyRequest.fees,
      tax: propertyRequest.tax,
      createdAt: new Date().toISOString()
  }
  return await propertyAccess.createProperty(newProperty)
}

export async function getProperties(userId: string): Promise<PropertyItem[]> {
  return await propertyAccess.getProperties(userId)
}

export async function deleteProperty(propertyId: string) {
  await propertyAccess.deleteProperty(propertyId)
}

// Business logic for updating a Property item
export async function updateProperty(propertyId: string, propertyRequest: CreateUpdatePropertyRequest) {
  await propertyAccess.updateProperty(propertyId, propertyRequest.address, propertyRequest.neighborhood, propertyRequest.price, propertyRequest.fees, propertyRequest.tax)
}

// Ask File storage service for a temporary URL
export async function generateUploadUrl(propertyId: string) {
  return await fileLayerAccess.getSignedUrl(propertyId)
}

// Update URL field in the Properties table
export async function updatePropertyUrl(propertyId: string) {
  await propertyAccess.updateUrl(propertyId)

}