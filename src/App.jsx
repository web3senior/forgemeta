import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Metadata from './assets/metadata.json'
import { PinataSDK } from 'pinata'
import html2canvas from 'html2canvas'
import styles from './App.module.scss'

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_API_KEY,
  pinataGateway: 'example-gateway.mypinata.cloud',
})

function App() {
  const [showLog, setshowLog] = useState(false)
  const SVG = useRef()
  const GATEWAY = `https://ipfs.io/ipfs/`
  const CID = `QmYqTp8m3BL1zzP72Y45CbEx5JMTMcVxve4n2pSQc67b6Q`
  const BASE_URL = `http://localhost/luxgenerator/src/assets/pepito-pfp/` //`${GATEWAY}${CID}/` // Or 

  const weightedRandom = (items) => {
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0)
    const randomNum = Math.random() * totalWeight

    let weightSum = 0
    for (const item of items) {
      weightSum += item.weight
      if (randomNum <= weightSum) {
        return item.name
      }
    }
  }

  const download = () => {
    const htmlStr = SVG.current.outerHTML
    console.log(htmlStr)
    const blob = new Blob([htmlStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('download', 'pepito-genesis-nft.svg')
    a.setAttribute('href', url)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const Log =(msg)=>{
    toast.success(`${msg}`)
  }

  const generate = async () => {
    const svgns = 'http://www.w3.org/2000/svg'

    // Clear the board
    SVG.current.innerHTML = ''

    // Background
    const image1 = document.createElementNS(svgns, 'image')
    const group1 = document.createElementNS(svgns, 'g')
    group1.setAttribute('name', `backgroundGroup`)

    await fetch(`${BASE_URL}background/${weightedRandom(Metadata.background)}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        // const url = URL.createObjectURL(blob)

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          image1.setAttribute('href', base64data)
          image1.setAttribute('width', 400)
          image1.setAttribute('height', 400)
          image1.setAttribute('x', 0)
          image1.setAttribute('y', 0)
          image1.setAttribute('style', ``)
          showLog && image1.addEventListener('load', () => Log(`Background has been loaded`))

          // Add to the group
          group1.appendChild(image1)
        }
      })

    SVG.current.appendChild(group1)

    // Skin
    const image2 = document.createElementNS(svgns, 'image')
    const group2 = document.createElementNS(svgns, 'g')
    group2.setAttribute('name', `skinGroup`)

    await fetch(`${BASE_URL}skin/${weightedRandom(Metadata.skin)}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        // const url = URL.createObjectURL(blob)

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          image2.setAttribute('href', base64data)
          image2.setAttribute('width', 400)
          image2.setAttribute('height', 400)
          image2.setAttribute('x', 0)
          image2.setAttribute('y', 0)
          image2.setAttribute('style', ``)
          showLog && image2.addEventListener('load', () => Log(`Skin has been loaded`))

          // Add to the group
          group2.appendChild(image2)
        }
      })

    SVG.current.appendChild(group2)

    // Eyes
    const image3 = document.createElementNS(svgns, 'image')
    const group3 = document.createElementNS(svgns, 'g')
    group3.setAttribute('name', `skinGroup`)

    await fetch(`${BASE_URL}skin/${weightedRandom(Metadata.skin)}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        // const url = URL.createObjectURL(blob)

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          image3.setAttribute('href', base64data)
          image3.setAttribute('width', 400)
          image3.setAttribute('height', 400)
          image3.setAttribute('x', 0)
          image3.setAttribute('y', 0)
          image3.setAttribute('style', ``)
          showLog && image3.addEventListener('load', () => Log(`Eyes has been loaded`))

          // Add to the group
          group3.appendChild(image3)
        }
      })

    SVG.current.appendChild(group3)

    // Tattoo
    const image4 = document.createElementNS(svgns, 'image')
    const group4 = document.createElementNS(svgns, 'g')
    group4.setAttribute('name', `tattooGroup`)

    await fetch(`${BASE_URL}tattoo/${weightedRandom(Metadata.tattoo)}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        // const url = URL.createObjectURL(blob)

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          image4.setAttribute('href', base64data)
          image4.setAttribute('width', 400)
          image4.setAttribute('height', 400)
          image4.setAttribute('x', 0)
          image4.setAttribute('y', 0)
          image4.setAttribute('style', ``)
          showLog && image4.addEventListener('load', () => Log(`Tattoo has been loaded`))

          // Add to the group
          group4.appendChild(image4)
        }
      })

    SVG.current.appendChild(group4)


    // Clothes
    const image5 = document.createElementNS(svgns, 'image')
    const group5 = document.createElementNS(svgns, 'g')
    group5.setAttribute('name', `clothesGroup`)

    await fetch(`${BASE_URL}clothes/${weightedRandom(Metadata.clothes)}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        // const url = URL.createObjectURL(blob)

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          image5.setAttribute('href', base64data)
          image5.setAttribute('width', 400)
          image5.setAttribute('height', 400)
          image5.setAttribute('x', 0)
          image5.setAttribute('y', 0)
          image5.setAttribute('style', ``)
          showLog && image5.addEventListener('load', () => Log(`Clothes has been loaded`))

          // Add to the group
          group5.appendChild(image5)
        }
      })

    SVG.current.appendChild(group5)

    // Headgear
    const image6 = document.createElementNS(svgns, 'image')
    const group6 = document.createElementNS(svgns, 'g')
    group6.setAttribute('name', `headgearGroup`)

    await fetch(`${BASE_URL}headgear/${weightedRandom(Metadata.headgear)}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        // const url = URL.createObjectURL(blob)

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          image6.setAttribute('href', base64data)
          image6.setAttribute('width', 400)
          image6.setAttribute('height', 400)
          image6.setAttribute('x', 0)
          image6.setAttribute('y', 0)
          image6.setAttribute('style', ``)
          showLog && image6.addEventListener('load', () => Log(`Tattoo has been loaded`))

          // Add to the group
          group6.appendChild(image6)
        }
      })

    SVG.current.appendChild(group6)
  }

  const autoGenerate = async () => {
    for (let i = 0; i < 100; i++) {
      // Generate
      generate()

      // Download the generated SVG
      download()

      // Sleep for 2 seconds
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  const upload = async () => {
    const htmlStr = document.querySelector(`.${styles['board']} svg`).outerHTML
    const blob = new Blob([htmlStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    try {
      const t = toast.loading(`Uploading to IPFS`)
      const file = new File([blob], 'test.svg', { type: blob.type })
      const upload = await pinata.upload.file(file)
      console.log(upload)
      toast.dismiss(t)
      return upload.IpfsHash
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {}, [])

  return (
    <>
      <Toaster />

      <div className={`${styles.page}`}>
        <h3 className={``}>LSP8 metadata generator</h3>

        <div className={`${styles['board']} d-f-c`}>
          <svg ref={SVG} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" />
        </div>

        <div className={`${styles.actions}`}>
          <button onClick={() => autoGenerate()}>Auto Generate</button>
          <button onClick={() => generate()}>Generate</button>
          <button onClick={() => download()}>Download</button>
          <button onClick={() => upload()}>Upload</button>
        </div>
      </div>
    </>
  )
}

export default App
