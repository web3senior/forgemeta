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
  const [showLog, setShowLog] = useState(false)
  const SVG = useRef()
  const backgroundGroupRef = useRef()
  const skinGroupRef = useRef()
  const eyesGroupRef = useRef()
  const tattooGroupRef = useRef()
  const clothesGroupRef = useRef()
  const headgearGroupRef = useRef()
  const GATEWAY = `https://ipfs.io/ipfs/`
  const CID = `QmYqTp8m3BL1zzP72Y45CbEx5JMTMcVxve4n2pSQc67b6Q`
  const BASE_URL = `${GATEWAY}${CID}/` //`http://localhost/luxgenerator/src/assets/pepito-pfp/` //`${GATEWAY}${CID}/` // Or

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

  /**
   * Download
   */
  const download = () => {
    const htmlStr = SVG.current.outerHTML
    const blob = new Blob([htmlStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('download', 'result.svg')
    a.setAttribute('href', url)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const Log = (msg) => {
    toast.success(`${msg}`)
  }

  const generate = async (trait) => {
    const svgns = 'http://www.w3.org/2000/svg'

    // Clear the board
    // SVG.current.innerHTML = ''

   return await fetch(`${BASE_URL}${trait}/${weightedRandom(Metadata[`${trait}`])}.png`)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          const image = document.createElementNS(svgns, 'image')
          image.setAttribute('href', base64data)
          image.setAttribute('width', 400)
          image.setAttribute('height', 400)
          image.setAttribute('x', 0)
          image.setAttribute('y', 0)
          showLog && image.addEventListener('load', () => Log(`${trait} has been loaded`))

          // Add to the group
          switch (trait) {
            case `background`:
              backgroundGroupRef.current.innerHTML = ''
              backgroundGroupRef.current.appendChild(image)
              break
            case `skin`:
              skinGroupRef.current.innerHTML = ''
              skinGroupRef.current.appendChild(image)
              break
            case `eyes`:
              eyesGroupRef.current.innerHTML = ''
              eyesGroupRef.current.appendChild(image)
              break
            case `tattoo`:
              tattooGroupRef.current.innerHTML = ''
              tattooGroupRef.current.appendChild(image)
              break
            case `clothes`:
              clothesGroupRef.current.innerHTML = ''
              clothesGroupRef.current.appendChild(image)
              break
            case `headgear`:
              headgearGroupRef.current.innerHTML = ''
              headgearGroupRef.current.appendChild(image)
              break
            default:
              break
          }
        }
      })
  }

  const generateOne = async () => {
    generate(`background`)
    generate(`skin`)
    generate(`eyes`)
    generate(`tattoo`)
    generate(`clothes`)
    generate(`headgear`)
  }

  const autoGenerate = async () => {
    for (let i = 0; i < 200; i++) {
      // Generate
      await Promise.all([generate(`background`), generate(`skin`), generate(`eyes`), generate(`tattoo`), generate(`clothes`), generate(`headgear`)]).then((values) => {
        console.log(values)
        download()
      })

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
          <svg ref={SVG} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g ref={backgroundGroupRef} name={`backgroundGroup`} />
            <g ref={skinGroupRef} name={`skinGroup`} />
            <g ref={eyesGroupRef} name={`eyesGroup`} />
            <g ref={tattooGroupRef} name={`tattooGroup`} />
            <g ref={clothesGroupRef} name={`clothesGroup`} />
            <g ref={headgearGroupRef} name={`headgearGroup`} />
          </svg>
        </div>
        <div className={`${styles.actions}`}>
          {/* <button onClick={() => autoGenerate()}>Auto Generate</button> */}
          <button onClick={() => generateOne()}>Generate</button>
          <button onClick={() => download()}>Download</button>
          {/* <button onClick={() => upload()}>Upload</button> */}
        </div>
      </div>
    </>
  )
}

export default App
