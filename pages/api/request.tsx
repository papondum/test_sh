import { db, storage } from '../../components/Firebase'
import { ref, set, onValue, get, child } from "firebase/database";
import { uploadImage } from './storage';
export async function saveMarker(lat:number, lng:number, name: string) {
    const response = set(ref(db, 'mark/'  + name), {
      name,
      lat,
      lng
    })
    return response
  }
  
export async function saveRadius(radius:string) {
    const response = set(ref(db, 'rad/'), {
    rad:radius
    })
    return response
}

export async function saveCheckin(lat:number, lng:number, name: string, img:any) {
  const date = new Date().getTime()
  const upload = await uploadImage(img, date)
  const response = await set(ref(db, 'checkin/'  + date), {
    name,
    date,
    lat,
    lng
  })
}