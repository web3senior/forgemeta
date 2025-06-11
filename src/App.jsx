import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
//import Metadata from './assets/metadata.json'
import { PinataSDK } from 'pinata'
import html2canvas from 'html2canvas'
import ABI from './assets/abi.json'
import Web3 from 'web3'
import styles from './App.module.scss'

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_API_KEY,
  pinataGateway: 'example-gateway.mypinata.cloud',
})

const web3 = new Web3(window.lukso)

function App() {
  const SVG = useRef()

  // Traits ref
  const backgroundGroupRef = useRef()
  const bodycolorGroupRef = useRef()
  const expressionGroupRef = useRef()
  const bodyGroupRef = useRef()
  const headGroupRef = useRef()
  const extraGroupRef = useRef()

  const GATEWAY = `https://ipfs.io/ipfs/`
  const CID = `bafybeihqjtxnlkqwykthnj7idx6ytivmyttjcm4ckuljlkkauh6nm3lzve`
  const BASE_URL = `http://localhost/forgemeta/src/assets/lukseals-collection/level1/` //`http://localhost/luxgenerator/src/assets/pepito-pfp/` //`${GATEWAY}${CID}/` // Or //`${GATEWAY}${CID}/` //

  const weightedRandom = (items) => {
    console.log(items)
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0)
    const randomNum = Math.random() * totalWeight

    let weightSum = 0
    for (const item of items) {
      weightSum += item.weight
      if (randomNum <= weightSum) {
        console.log(item.name)
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
  // const background = await generate(`background`)
  // const bodycolor = await generate(`bodycolor`)
  // const expression = await generate(`expression`)
  // const body = await generate(`body`)
  // const head = await generate(`head`)
  // const extra = await generate(`extra`)

  const generate = async (trait) => {
    const svgns = 'http://www.w3.org/2000/svg'

    // Clear the board
    // SVG.current.innerHTML = ''
    const Metadata = JSON.parse(document.querySelector(`.metadata`).value)
    const randomTrait = weightedRandom(Metadata[`${trait}`])
    await fetch(`${BASE_URL}${trait}/${randomTrait}.png`)
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
          image.addEventListener('load', () => console.log(`${trait} has been loaded`))

          // Add to the group
          switch (trait) {
            case `background`:
              backgroundGroupRef.current.innerHTML = ''
              backgroundGroupRef.current.appendChild(image)
              break
            case `bodycolor`:
              bodycolorGroupRef.current.innerHTML = ''
              bodycolorGroupRef.current.appendChild(image)
              break
            case `expression`:
              expressionGroupRef.current.innerHTML = ''
              expressionGroupRef.current.appendChild(image)
              break
            case `body`:
              bodyGroupRef.current.innerHTML = ''
              bodyGroupRef.current.appendChild(image)
              break
            case `head`:
              headGroupRef.current.innerHTML = ''
              headGroupRef.current.appendChild(image)
              break
            case `extra`:
              extraGroupRef.current.appendChild(image)
              extraGroupRef.current.innerHTML = ''
              break
            default:
              break
          }
        }
      })

    return randomTrait
  }

  const generateMetadata = async (base, background, bodycolor, mouth, head, head1, back) => {
    const uploadedCID = await upload()
    const verifiableUrl = await rAsset(uploadedCID)
    console.log(uploadedCID)
    console.log(`verifiableUrl:`, verifiableUrl)
    console.log(web3.utils.keccak256(verifiableUrl))
    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({
          LSP4Metadata: {
            name: 'Dracos',
            description: `Forged in the molten heart of the Ember Rift, the Dracos are a legendary brood born from the mystical Feralyx Eggs. Each Dragon is infused with the raw power of fire, chaos and untamed greed. Hatched in the infernal chasms of the Rift, these dragons rise as supreme guardians of gold treasure and ancient magic.

Every dragon is an embodiment of power, adorned with unique traits and hoarded relics from civilizations long forgotten. As the eternal keepers of this realm, they are bound to the Ember Rift, where their glory, fury and insatiable hunger for treasure shape the fate of all who dare enter.

🔥 7,777 Dracos: Born from the Rift, Bound by Gold 🪙`,
            links: [
              { title: 'Mint', url: 'https://universaleverything.io/0x8A985fe01eA908F5697975332260553c454f8F77' },
              { title: '𝕏', url: 'https://x.com/DracosKodo' },
            ],
            attributes: [
              { key: 'Base', value: base.toUpperCase() },
              { key: 'Background', value: background.toUpperCase() },
              { key: 'bodycolor', value: bodycolor.toUpperCase() },
              { key: 'Mouth', value: mouth.toUpperCase() },
              { key: 'Head', value: head.toUpperCase() },
              { key: 'head', value: head.toUpperCase() },
              { key: 'Back', value: back.toUpperCase() },
            ],
            icon: [
              {
                width: 512,
                height: 512,
                url: 'ipfs://bafybeiaziuramvgnceele5wetw5tt65bgp2z63faax7ihvrjd4wlvfsooq',
                verification: {
                  method: 'keccak256(bytes)',
                  data: '0xe99121bbedf99dcf763f1a216ca8cd5847bce15e6930df1e92913c56367f92d1',
                },
              },
            ],
            backgroundImage: [],
            assets: [],
            images: [
              [
                {
                  width: 1000,
                  height: 1000,
                  url: `ipfs://${uploadedCID}`,
                  verification: {
                    method: 'keccak256(bytes)',
                    data: web3.utils.keccak256(verifiableUrl),
                  },
                },
              ],
            ],
          },
        })
      )
    var dlAnchorElem = document.getElementById('downloadAnchorElem')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', 'generated-metadata.json')
    dlAnchorElem.click()
  }

  const generateOne = async () => {
    const background = await generate(`background`)
    const bodycolor = await generate(`bodycolor`)
    const expression = await generate(`expression`)
    const body = await generate(`body`)
    const head = await generate(`head`)
    const extra = await generate(`extra`)

    document.querySelector(`#result`).innerHTML = `Background: ${background}  | bodycolor: ${bodycolor} |  expression: ${expression}  | body: ${body}  | head: ${head}  | extra: ${extra}`

    // generateMetadata(base, background, bodycolor, mouth, head, head, back)
  }

  const autoGenerate = async () => {
    const loop_count = document.querySelector(`[name="autogenerate"]`).value
    for (let i = 0; i < loop_count; i++) {
      // Generate
      await Promise.all([generate(`base`), generate(`background`), generate(`bodycolor`), generate(`mouth`), generate(`head`), generate(`head`), generate(`back`)]).then((values) => {
        console.log(values)
        generateMetadata(values[0], values[1], values[2], values[3], values[4], values[5], values[6])
        download()
      })

      // Sleep for 2 seconds
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  const rAsset = async (cid) => {
    const assetBuffer = await fetch(`https://ipfs.io/ipfs/${cid}`).then(async (response) => {
      return response.arrayBuffer().then((buffer) => new Uint8Array(buffer))
    })

    return assetBuffer
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

  const setData = async (e) => {
    const t = toast.loading(`Waiting for transaction's confirmation`)
    e.target.innerText = `Waiting...`
    if (typeof window.lukso === 'undefined') window.open('https://chromewebstore.google.com/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en-US&utm_source=candyzap.com', '_blank')
    const web3 = new Web3(window.lukso || window.ethereum)

    const account = web3.eth.accounts.privateKeyToAccount('0x593afe8f8cea4690eebdac407cbaea4b9ac99054a8424e299451d61fbc3042bc')
    console.log(`Wallet:`, account.address)
    const contract = new web3.eth.Contract(ABI, `0x40bda5CFBa4B340e1d4Ea6d798ae597F1E0e0dB0`)
    try {
      // window.lukso
      //   .request({ method: 'eth_requestAccounts' })
      //   .then((accounts) => {        })
      //const account = accounts[0]

      web3.eth.defaultAccount = account.address

      // web3.eth.accounts.signTransaction(tx, account.privateKey [, callback]);

      contract.methods
        .pause()
        .send({
          from: account.address,
        })
        .on('error', function (error) {
          console.log(error)
        })
        .on('transactionHash', function (transactionHash) {
          console.log(transactionHash)
        })
        .on('receipt', function (receipt) {
          console.log(receipt.contractAddress) // contains the new contract address
        })
        .on('confirmation', function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt)
        })
        .then(function (newContractInstance) {
          console.log(newContractInstance.options.address) // instance with the new contract address
        })

      return

      contract.methods
        .totalSupply()
        // .send({
        //   from: account.address,
        // })
        .then((res) => {
          console.log(res) //res.events.tokenId
          toast.success(`Done`)

          e.target.innerText = `setlsp8Data`
          toast.dismiss(t)
        })
        .catch((error) => {
          e.target.innerText = `setlsp8Data`
          toast.dismiss(t)
        })
        // Stop loader when connected
        //connectButton.classList.remove("loadingButton");

        .catch((error) => {
          e.target.innerText = `setlsp8Data`
          // Handle error
          console.log(error, error.code)
          toast.dismiss(t)
          // Stop loader if error occured

          // 4001 - The request was rejected by the user
          // -32602 - The parameters were invalid
          // -32603- Internal error
        })
    } catch (error) {
      console.log(error)
      toast.dismiss(t)
      e.target.innerText = `Mint`
    }
  }

  useEffect(() => {}, [])

  return (
    <>
      <Toaster />
      <a href="" id="downloadAnchorElem"></a>
      <div className={`${styles.page}`}>
        Config:
        <textarea
          style={{ height: `100px` }}
          className="metadata"
          defaultValue={`{
  "background": [
    { "name": "Red", "weight": 20 },
    { "name": "Yellow", "weight": 20 },
    { "name": "Gray", "weight": 20 },
    { "name": "Blue", "weight": 20 },
    { "name": "Green", "weight": 20 }
  ],
  "bodycolor": [
    { "name": "CommonCream", "weight": 80 },
    { "name": "CommonWhite", "weight": 80 },
    { "name": "CommonBlue", "weight": 80 },
    { "name": "CommonGreen", "weight": 80 },
    { "name": "UncommonPink", "weight": 40 },
    { "name": "UncommonViolet", "weight": 40 },
    { "name": "UncommonBlue", "weight": 40 },
    { "name": "UncommonGreen", "weight": 40 },
    { "name": "RareGalaxy", "weight": 15 },
    { "name": "SuperrareSkelleton", "weight": 5 }
  ],
  "expression": [
    { "name": "Watching", "weight": 20 },
    { "name": "Normal", "weight": 40 },
    { "name": "Surprised", "weight": 20 },
    { "name": "Tired", "weight": 20 },
    { "name": "Sleepy", "weight": 20 },
    { "name": "Dirty", "weight": 20 },
    { "name": "Pasta", "weight": 10 },
    { "name": "Pizza", "weight": 10 },
    { "name": "Icecream", "weight": 10 },
    { "name": "Angry", "weight": 20 },
    { "name": "Blush", "weight": 20 },
    { "name": "Lolipop", "weight": 10 }
  ],
  "body": [
    { "name": "WoolBrown", "weight": 10 },
    { "name": "WoolBeige", "weight": 10 },
    { "name": "Soldier", "weight": 10 },
    { "name": "ScarfRed", "weight": 10 },
    { "name": "ScarfBlue", "weight": 10 },
    { "name": "Rome", "weight": 10 },
    { "name": "RainydaysYellow", "weight": 10 },
    { "name": "RainydaysWhite", "weight": 10 },
    { "name": "RainydaysBrown", "weight": 10 },
    { "name": "Puffer", "weight": 10 },
    { "name": "Pirate", "weight": 10 },
    { "name": "Painter", "weight": 10 },
    { "name": "Ninja", "weight": 10 },
    { "name": "Mexican", "weight": 10 },
    { "name": "King", "weight": 10 },
    { "name": "KimonoLove", "weight": 10 },
    { "name": "KimonoLeaves", "weight": 10 },
    { "name": "KimonoClouds", "weight": 10 },
    { "name": "KimonoCitrone", "weight": 10 },
    { "name": "Jordan", "weight": 10 },
    { "name": "Inuit", "weight": 10 },
    { "name": "Indian", "weight": 10 },
    { "name": "HoodyWhite", "weight": 10 },
    { "name": "HoodyOrange", "weight": 10 },
    { "name": "HoodyBlue", "weight": 10 },
    { "name": "Fireman", "weight": 10 },
    { "name": "DinoOrange", "weight": 10 },
    { "name": "DinoGreen", "weight": 10 },
    { "name": "Dino", "weight": 10 },
    { "name": "Cowboy", "weight": 10 },
    { "name": "Cook", "weight": 10 },
    { "name": "Chain", "weight": 10 },
    { "name": "Business", "weight": 10 },
    { "name": "Arab", "weight": 10 },
    { "name": "AngelWings", "weight": 10 },
    { "name": "None", "weight": 5 }
  ],
  "head": [
    { "name": "WoolHat", "weight": 10 },
    { "name": "Sombrero", "weight": 10 },
    { "name": "SoldierHat", "weight": 10 },
    { "name": "PirateHat", "weight": 10 },
    { "name": "NinjaHeadbands", "weight": 10 },
    { "name": "Laurel", "weight": 10 },
    { "name": "Indian", "weight": 10 },
    { "name": "Horns", "weight": 10 },
    { "name": "Headphones", "weight": 10 },
    { "name": "Halo", "weight": 10 },
    { "name": "Hair", "weight": 10 },
    { "name": "FiremanHelmet", "weight": 10 },
    { "name": "Durag", "weight": 10 },
    { "name": "Crown", "weight": 10 },
    { "name": "CowboyHat", "weight": 10 },
    { "name": "CookHat", "weight": 10 },
    { "name": "Cap", "weight": 10 },
    { "name": "BrownCurly", "weight": 10 },
    { "name": "BlackCurly", "weight": 10 },
    { "name": "Beret", "weight": 10 },
    { "name": "Bearears", "weight": 10 },
    { "name": "Bandit", "weight": 5 },
    { "name": "Arab", "weight": 10 },
    { "name": "None", "weight": 5 }
  ],
  "extra": [
    { "name": "None", "weight": 90 },
    { "name": "MariaShades", "weight": 5 },
    { "name": "Shades", "weight": 5 }
  ]
}
`}
        ></textarea>
        <h3 className={``}>NFT metadata generator</h3>
        <div className={`${styles['board']} d-f-c card`}>
          <svg ref={SVG} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g ref={backgroundGroupRef} name={`backgroundGroup`} />
            <g ref={bodycolorGroupRef} name={`bodycolorGroup`} />
            <g ref={expressionGroupRef} name={`expressionGroup`} />
            <g ref={bodyGroupRef} name={`bodyGroup`} />
            <g ref={headGroupRef} name={`headGroup`} />
            <g ref={extraGroupRef} name={`extraGroup`} />
          </svg>
        </div>
        <div style={{ display: `none` }}>
          <input type="text" name="autogenerate" id="" placeholder="Auto Generate Number" />

          <button onClick={() => autoGenerate()}>Auto Generate & download</button>
        </div>
        <div className={`${styles.actions}`}>
          <div id="result"></div>
          <div className=" d-flex">
            <button onClick={() => generateOne()}>Generate a pfp</button>
            <button onClick={() => download()}>Download</button>
            <button onClick={() => upload()}>Upload</button>
          </div>
          {/*<button onClick={(e) => setData(e)}>setLSP8metadata</button>*/}
        </div>
      </div>
    </>
  )
}

export default App
