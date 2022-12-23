import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Map, {MapData} from '../components/Map'
import Navigate from '../components/Navigation'
import { db } from '../components/Firebase'
import Loading from '../components/Loading'
import { ref, set, onValue, get, child } from "firebase/database";
import useLocationHook from '../hooks'

export default function Home({data, rad}:MapData) {  
  const location = useLocationHook()
  
  return (
    <>
      <Head>
        <title>Checkin</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <Navigate/>
        <section className="container mx-auto">
          {location ? <Map data={data} rad={rad} current={location}/>:<Loading height={350}/>}
        </section>
        <p className=" text-gray-500 text-center mt-3">Click inner marker to checkin!</p>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const dbRef = ref(db);
  const _data = await get(child(dbRef, `mark/`))
  const _rad = await get(child(dbRef, `rad/`))
  const data = await _data.toJSON()
  const rad = await _rad.toJSON()
  return {
    props: {
      data,rad
    },
  }
}
