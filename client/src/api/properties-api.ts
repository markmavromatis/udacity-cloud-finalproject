import { apiEndpoint } from '../config'
import { Property } from '../types/Property';
import Axios from 'axios'
import { CreateUpdatePropertyRequest } from '../types/CreateUpdatePropertyRequest';

export async function getProperties(idToken: string): Promise<Property[]> {
  console.log('Fetching properties')

  // const response = await Axios.get(`${apiEndpoint}/todos`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${idToken}`
  //   },
  // })
  // let response = {};
  // response["data"] = [{}];
  let properties : Property[] = []
  properties.push({propertyId: "1", createdAt: (new Date()).toISOString(), address: "524 Manhattan Ave 2B",
  neighborhood: "Greenpoint", price: 1299999, fees: 850, tax: 1000, attachmentUrl: undefined})
  
  return properties
}

export async function createProperty(
  idToken: string,
  newProperty: CreateUpdatePropertyRequest
): Promise<Property> {
  const response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newProperty), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchProperty(
  idToken: string,
  propertyId: string,
  updatedProperty: CreateUpdatePropertyRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${propertyId}`, JSON.stringify(updatedProperty), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteProperty(
  idToken: string,
  propertyId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/properties/${propertyId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  propertyId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/properties/${propertyId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
