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
  const baseGroupRef = useRef()
  const backgroundGroupRef = useRef()
  const eyesGroupRef = useRef()
  const mouthGroupRef = useRef()
  const headGroupRef = useRef()
  const clothingGroupRef = useRef()
  const backGroupRef = useRef()
  const GATEWAY = `https://ipfs.io/ipfs/`
  const CID = `bafybeihqjtxnlkqwykthnj7idx6ytivmyttjcm4ckuljlkkauh6nm3lzve`
  const BASE_URL = `${GATEWAY}${CID}/` // `http://localhost/luxgenerator/src/assets/pepito-pfp/` //`http://localhost/luxgenerator/src/assets/pepito-pfp/` //`${GATEWAY}${CID}/` // Or

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
            case `base`:
              baseGroupRef.current.innerHTML = ''
              baseGroupRef.current.appendChild(image)
              break
            case `background`:
              backgroundGroupRef.current.innerHTML = ''
              backgroundGroupRef.current.appendChild(image)
              break
            case `eyes`:
              eyesGroupRef.current.innerHTML = ''
              eyesGroupRef.current.appendChild(image)
              break
            case `mouth`:
              mouthGroupRef.current.innerHTML = ''
              mouthGroupRef.current.appendChild(image)
              break
            case `head`:
              headGroupRef.current.innerHTML = ''
              headGroupRef.current.appendChild(image)
              break
            case `clothing`:
              clothingGroupRef.current.innerHTML = ''
              clothingGroupRef.current.appendChild(image)
              break
            case `back`:
              backGroupRef.current.innerHTML = ''
              backGroupRef.current.appendChild(image)
              break
            default:
              break
          }
        }
      })

    return randomTrait
  }

  const generateMetadata = async (base, background, eyes, mouth, head, clothing, back) => {
    const uploadedCID = await upload()
    const verifiableUrl = await rAsset(uploadedCID)
    console.log(uploadedCID)
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
              { key: 'Eyes', value: eyes.toUpperCase() },
              { key: 'Mouth', value: mouth.toUpperCase() },
              { key: 'Head', value: head.toUpperCase() },
              { key: 'Clothing', value: clothing.toUpperCase() },
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
    const back = await generate(`back`)
    const base = await generate(`base`)
    const clothing = await generate(`clothing`)
    const eyes = await generate(`eyes`)
    const mouth = await generate(`mouth`)
    const head = await generate(`head`)
  

    document.querySelector(`#result`).innerHTML=`Base: ${base} | Background: ${background}  | Eyes: ${eyes} |  Mouth: ${mouth}  | Head: ${head}  | Clothing: ${clothing}  | Back: ${back}`;

    generateMetadata(base, background, eyes, mouth, head, clothing, back)
  }

  const autoGenerate = async () => {
    const loop_count = document.querySelector(`[name="autogenerate"]`).value
    for (let i = 0; i < loop_count; i++) {
      // Generate
      await Promise.all([generate(`base`), generate(`background`), generate(`eyes`), generate(`mouth`), generate(`head`), generate(`clothing`), generate(`back`)]).then((values) => {
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
  "base": [
    { "name": "none", "weight": 0 },

    { "name": "blue", "weight": 50 },
    { "name": "brown", "weight": 50 },
    { "name": "green", "weight": 50 },
    { "name": "grey", "weight": 50 },
    { "name": "purple", "weight": 50 },
    { "name": "violet", "weight": 50 },
    { "name": "yellow_green", "weight": 50 },

    { "name": "black_robot", "weight": 30 },
    { "name": "crystal", "weight": 30 },
    { "name": "glitch", "weight": 30 },
    { "name": "silver_robot", "weight": 30 },
    { "name": "tatted", "weight": 30 },

    { "name": "reptile", "weight": 15 },
    { "name": "tiger", "weight": 15 },
    { "name": "zombie", "weight": 15 },

    { "name": "alien", "weight": 5 },
    { "name": "gold", "weight": 5 }
  ],
  "background": [
    { "name": "none", "weight": 0 },

    { "name": "blue", "weight": 40 },
    { "name": "gray", "weight": 40 },
    { "name": "grey", "weight": 40 },
    { "name": "purple", "weight": 40 },
    { "name": "red", "weight": 40 },

    { "name": "chartreuse", "weight": 30 },
    { "name": "electric_blue", "weight": 30 },
    { "name": "magenta", "weight": 30 },
    { "name": "orange_peel", "weight": 30 },
    { "name": "peach", "weight": 30 },

    { "name": "shadow", "weight": 20 },
    { "name": "sunset", "weight": 20 },

    { "name": "criminal", "weight": 10 },
    { "name": "pink", "weight": 10 }
  ],
  "eyes": [
    { "name": "none", "weight": 0 },

    { "name": "bloodshot", "weight": 40 },
    { "name": "dragon", "weight": 40 },
    { "name": "ski_goggles", "weight": 40 },
    { "name": "sleepy", "weight": 40 },
    { "name": "sunglasses", "weight": 40 },
    { "name": "wide", "weight": 40 },

    { "name": "3d_glasses", "weight": 30 },
    { "name": "birthmark", "weight": 30 },
    { "name": "visor", "weight": 30 },
    { "name": "vr_goggles", "weight": 30 },

    { "name": "bttf", "weight": 20 },
    { "name": "fire", "weight": 20 },
    { "name": "tyler_durden", "weight": 20 },

    { "name": "kano", "weight": 10 },
    { "name": "laser", "weight": 10 }
  ],
  "mouth": [
    { "name": "none", "weight": 0 },

    { "name": "beard", "weight": 40 },
    { "name": "bubblegum", "weight": 40 },
    { "name": "closed", "weight": 40 },
    { "name": "fury", "weight": 40 },
    { "name": "joint", "weight": 40 },
    { "name": "sad", "weight": 40 },

    { "name": "rose", "weight": 30 },
    { "name": "diamond_grill", "weight": 30 },
    { "name": "pipe", "weight": 30 },
    { "name": "rainbow_grill", "weight": 30 },

    { "name": "cyber_punk", "weight": 20 },
    { "name": "hannibal", "weight": 20 },
    { "name": "white_beard", "weight": 20 },

    { "name": "fire", "weight": 10 },
    { "name": "gold_grill", "weight": 10 }
  ],
  "head": [
    { "name": "none", "weight": 50 },

    { "name": "arrow", "weight": 20 },
    { "name": "bandana", "weight": 20 },
    { "name": "beanie", "weight": 20 },
    { "name": "birthday", "weight": 20 },
    { "name": "cowboy", "weight": 20 },
    { "name": "festive", "weight": 20 },
    { "name": "fox_mask", "weight": 20 },
    { "name": "headphones", "weight": 20 },
    { "name": "japanese_bandana", "weight": 20 },
    { "name": "pilot", "weight": 20 },
    { "name": "prisoner", "weight": 20 },
    { "name": "rasta", "weight": 20 },
    { "name": "silver_earring", "weight": 20 },
    { "name": "trucker_hat", "weight": 20 },

    { "name": "arrow_head", "weight": 15 },
    { "name": "bowler_hat", "weight": 15 },
    { "name": "bunny_ears", "weight": 15 },
    { "name": "devil_mask", "weight": 15 },
    { "name": "dracuto", "weight": 15 },
    { "name": "flowers", "weight": 15 },
    { "name": "frog_mask", "weight": 15 },
    { "name": "gold_earring", "weight": 15 },
    { "name": "peaky", "weight": 15 },
    { "name": "pirate", "weight": 15 },

    { "name": "devil_horns", "weight": 10 },
    { "name": "metaheads", "weight": 10 },
    { "name": "mohawk", "weight": 10 },
    { "name": "raiden", "weight": 10 },
    { "name": "trump", "weight": 10 },
    { "name": "unicorn", "weight": 10 },

    { "name": "crown", "weight": 5 },
    { "name": "halo", "weight": 5 },
    { "name": "samurai_helmet", "weight": 5 }
  ],
  "clothing": [
    { "name": "none", "weight": 10 },

    { "name": "aqua_hoodie", "weight": 40 },
    { "name": "bomber_jacket", "weight": 40 },
    { "name": "bulletproof_vest", "weight": 40 },
    { "name": "cowboy", "weight": 40 },
    { "name": "cyber_punk", "weight": 40 },
    { "name": "doc", "weight": 40 },
    { "name": "gigilo", "weight": 40 },
    { "name": "green_hoodie", "weight": 40 },
    { "name": "green_shirt", "weight": 40 },
    { "name": "leather_jacket", "weight": 40 },
    { "name": "neo", "weight": 40 },
    { "name": "ninja", "weight": 40 },
    { "name": "overalls", "weight": 40 },
    { "name": "purple_hoodie", "weight": 40 },
    { "name": "red_t", "weight": 40 },
    { "name": "silver_chain", "weight": 40 },
    { "name": "skeleton_jacket", "weight": 40 },
    { "name": "spartan", "weight": 40 },
    { "name": "squid", "weight": 40 },
    { "name": "stock_broker", "weight": 40 },

    { "name": "ace", "weight": 30 },
    { "name": "astro", "weight": 30 },
    { "name": "beetle", "weight": 30 },
    { "name": "burned_t", "weight": 30 },
    { "name": "dress", "weight": 30 },
    { "name": "dumb", "weight": 30 },
    { "name": "dumber", "weight": 30 },
    { "name": "freddy", "weight": 30 },
    { "name": "fur_coat", "weight": 30 },
    { "name": "gold_hoodie", "weight": 30 },
    { "name": "hans", "weight": 30 },
    { "name": "insane", "weight": 30 },
    { "name": "lumbergh", "weight": 30 },
    { "name": "rambo", "weight": 30 },
    { "name": "red", "weight": 30 },
    { "name": "robin_hood", "weight": 30 },
    { "name": "wizerd", "weight": 30 },

    { "name": "barbie", "weight": 15 },
    { "name": "bateman", "weight": 15 },
    { "name": "castle", "weight": 15 },
    { "name": "draku", "weight": 15 },
    { "name": "godfather", "weight": 15 },
    { "name": "gold_chain", "weight": 15 },
    { "name": "homelander", "weight": 15 },
    { "name": "joker", "weight": 15 },
    { "name": "kill", "weight": 15 },
    { "name": "panther", "weight": 15 },
    { "name": "pink_hoodie", "weight": 15 },
    { "name": "powers", "weight": 15 },
    { "name": "ranger", "weight": 15 },
    { "name": "superhero", "weight": 15 },
    { "name": "toga", "weight": 15 },
    { "name": "tyler_durden", "weight": 15 },

    { "name": "john_mcclane", "weight": 5 },
    { "name": "samurai_armor", "weight": 5 },
    { "name": "shang_tsung", "weight": 5 },
    { "name": "snake", "weight": 5 },
    { "name": "venom", "weight": 5 },
    { "name": "mystique", "weight": 5 }
  ],
  "back": [
    { "name": "none", "weight": 65 },

    { "name": "medieval_sword", "weight": 15 },
    { "name": "rpg", "weight": 15 },
    { "name": "shield", "weight": 15 },
    { "name": "wings", "weight": 15 },

    { "name": "angel", "weight": 10 },
    { "name": "devil", "weight": 10 },
    { "name": "katanas", "weight": 10 },

    { "name": "fire_wings", "weight": 7 },
    { "name": "robot_arms", "weight": 7 },

    { "name": "gold_wings", "weight": 3 }
  ]
}
`}
        ></textarea>
        <h3 className={``}>LSP8 metadata generator</h3>
        <div className={`${styles['board']} d-f-c card`}>
          <svg ref={SVG} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g ref={backgroundGroupRef} name={`backgroundGroup`} />
            <g ref={backGroupRef} name={`backGroup`} />
            <g ref={baseGroupRef} name={`baseGroup`} />
            <g ref={clothingGroupRef} name={`clothingGroup`} />
            <g ref={eyesGroupRef} name={`eyesGroup`} />
            <g ref={mouthGroupRef} name={`mouthGroup`} />
            <g ref={headGroupRef} name={`headGroup`} />
          </svg>
        </div>
        <div className={`${styles.actions} d-flex`}>
          <input type="text" name="autogenerate" id="" placeholder="Auto Generate Number" />
          <button onClick={() => autoGenerate()}>Auto Generate & download</button>

          <div id="result"></div>
          <button style={{ marginTop: `1rem` }} onClick={() => generateOne()}>
            Generate a pfp
          </button>
          <button onClick={() => download()}>Download</button>
          <button onClick={() => upload()}>Upload</button>
          <button onClick={(e) => setData(e)}>setLSP8metadata</button>
        </div>
      </div>
    </>
  )
}

export default App
