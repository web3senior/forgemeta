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

function App() {
  const [showLog, setShowLog] = useState(true)
  const SVG = useRef()
  const baseGroupRef = useRef()
  const backgroundGroupRef = useRef()
  const eyesGroupRef = useRef()
  const mouthGroupRef = useRef()
  const headGroupRef = useRef()
  const clothingGroupRef = useRef()
  const backGroupRef = useRef()
  const GATEWAY = `https://ipfs.io/ipfs/`
  const CID = `bafybeie4xezei7nw4assxv55522nuiq65mwn2oqssv3cw2klwmwo6oreha`
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

  const Log = (msg) => {
    document.querySelector(`#log`).innerHTML += `<p>${msg}</p>`
  }

  const generate = async (trait) => {
    const svgns = 'http://www.w3.org/2000/svg'

    // Clear the board
    // SVG.current.innerHTML = ''
    const Metadata = JSON.parse(document.querySelector(`.metadata`).value)
    console.log(`${BASE_URL}${trait}/${weightedRandom(Metadata[`${trait}`])}.png`)
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
  }

  const generateOne = async () => {
    generate(`base`)
    generate(`background`)
    generate(`eyes`)
    generate(`mouth`)
    generate(`head`)
    generate(`clothing`)
    generate(`back`)
  }

  const autoGenerate = async () => {
    const loop_count = document.querySelector(`[name="autogenerate"]`).value
    for (let i = 0; i < loop_count; i++) {
      // Generate
      await Promise.all([generate(`base`), generate(`background`), generate(`eyes`), generate(`mouth`), generate(`head`), generate(`clothing`), generate(`back`)]).then((values) => {
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

      <div className={`${styles.page}`}>
        Config:
        <textarea style={{height:`300px`}} className='metadata'
        defaultValue={`{
  "base": [
    { "name": "none", "weight": 0 },

    { "name": "blue", "weight": 100 },
    { "name": "brown", "weight": 100 },
    { "name": "green", "weight": 100 },
    { "name": "grey", "weight": 100 },
    { "name": "purple", "weight": 100 },
    { "name": "violet", "weight": 100 },
    { "name": "yellow_green", "weight": 100 },

    { "name": "reptile", "weight": 50 },
    { "name": "tiger", "weight": 50 },
    { "name": "zombie", "weight": 50 },

    { "name": "alien", "weight": 15 },
    { "name": "gold", "weight": 15 },

    { "name": "black_robot", "weight": 5 },
    { "name": "crystal", "weight": 5 },
    { "name": "glitch", "weight": 5 },
    { "name": "silver_robot", "weight": 5 },
    { "name": "tatted", "weight": 5 }
  ],
  "background": [
    { "name": "none", "weight": 0 },

    { "name": "blue", "weight": 100 },
    { "name": "gray", "weight": 100 },
    { "name": "grey", "weight": 100 },
    { "name": "purple", "weight": 100 },
    { "name": "red", "weight": 100 },

    { "name": "shadow", "weight": 50 },
    { "name": "sunset", "weight": 50 },

    { "name": "criminal", "weight": 25 },
    { "name": "pink", "weight": 25 },

    { "name": "chartreuse", "weight": 10 },
    { "name": "electric_blue", "weight": 10 },
    { "name": "magenta", "weight": 10 },
    { "name": "orange_peel", "weight": 10 },
    { "name": "peach", "weight": 10 }
  ],
  "eyes": [
    { "name": "none", "weight": 0 },

    { "name": "bloodshot", "weight": 100 },
    { "name": "dragon", "weight": 100 },
    { "name": "ski_goggles", "weight": 100 },
    { "name": "sleepy", "weight": 100 },
    { "name": "sunglasses", "weight": 100 },
    { "name": "wide", "weight": 100 },

    { "name": "kano", "weight": 50 },
    { "name": "laser", "weight": 50 },

    { "name": "kano", "weight": 20 },
    { "name": "laser", "weight": 20 },

    { "name": "3d_glasses", "weight": 7 },
    { "name": "birthmark", "weight": 7 },
    { "name": "visor", "weight": 7 },
    { "name": "vr_goggles", "weight": 7 }
  ],
  "mouth": [
    { "name": "none", "weight": 0 },

    { "name": "beard", "weight": 100 },
    { "name": "bubblegum", "weight": 100 },
    { "name": "closed", "weight": 100 },
    { "name": "fury", "weight": 100 },
    { "name": "joint", "weight": 100 },
    { "name": "sad", "weight": 100 },

    { "name": "cyber_punk", "weight": 50 },
    { "name": "hannibal", "weight": 50 },
    { "name": "white_beard", "weight": 50 },

    { "name": "fire", "weight": 20 },
    { "name": "gold_grill", "weight": 20 },

    { "name": "rose", "weight": 10 },
    { "name": "diamond_grill", "weight": 10 },
    { "name": "pipe", "weight": 10 },
    { "name": "rainbow_grill", "weight": 10 }
  ],
  "head": [
    { "name": "none", "weight": 30 },

    { "name": "arrow", "weight": 70 },
    { "name": "bandana", "weight": 70 },
    { "name": "beanie", "weight": 70 },
    { "name": "birthday", "weight": 70 },
    { "name": "cowboy", "weight": 70 },
    { "name": "festive", "weight": 70 },
    { "name": "fox_mask", "weight": 70 },
    { "name": "headphones", "weight": 70 },
    { "name": "japanese_bandana", "weight": 70 },
    { "name": "pilot", "weight": 70 },
    { "name": "prisoner", "weight": 70 },
    { "name": "rasta", "weight": 70 },
    { "name": "silver_earring", "weight": 70 },
    { "name": "trucker_hat", "weight": 70 },

    { "name": "devil_horns", "weight": 40 },
    { "name": "metaheads", "weight": 40 },
    { "name": "mohawk", "weight": 40 },
    { "name": "raiden", "weight": 40 },
    { "name": "trump", "weight": 40 },
    { "name": "unicorn", "weight": 40 },

    { "name": "crown", "weight": 20 },
    { "name": "halo", "weight": 20 },
    { "name": "samurai_helmet", "weight": 20 },

    { "name": "arrow_head", "weight": 9 },
    { "name": "bowler_hat", "weight": 9 },
    { "name": "bunny_ears", "weight": 9 },
    { "name": "devil_mask", "weight": 9 },
    { "name": "dracuto", "weight": 9 },
    { "name": "flowers", "weight": 9 },
    { "name": "frog_mask", "weight": 9 },
    { "name": "gold_earring", "weight": 9 },
    { "name": "peaky", "weight": 9 },
    { "name": "pirate", "weight": 9 }
  ],
  "clothing": [
    { "name": "none", "weight": 10 },

    { "name": "aqua_hoodie", "weight": 90 },
    { "name": "bomber_jacket", "weight": 90 },
    { "name": "bulletproof_vest", "weight": 90 },
    { "name": "cowboy", "weight": 90 },
    { "name": "cyber_punk", "weight": 90 },
    { "name": "doc", "weight": 90 },
    { "name": "gigilo", "weight": 90 },
    { "name": "green_hoodie", "weight": 90 },
    { "name": "green_shirt", "weight": 90 },
    { "name": "leather_jacket", "weight": 90 },
    { "name": "neo", "weight": 90 },
    { "name": "ninja", "weight": 90 },
    { "name": "overalls", "weight": 90 },
    { "name": "purple_hoodie", "weight": 90 },
    { "name": "red_t", "weight": 90 },
    { "name": "silver_chain", "weight": 90 },
    { "name": "skeleton_jacket", "weight": 90 },
    { "name": "spartan", "weight": 90 },
    { "name": "squid", "weight": 90 },
    { "name": "stock_broker", "weight": 90 },

    { "name": "barbie", "weight": 60 },
    { "name": "bateman", "weight": 60 },
    { "name": "castle", "weight": 60 },
    { "name": "draku", "weight": 60 },
    { "name": "godfather", "weight": 60 },
    { "name": "gold_chain", "weight": 60 },
    { "name": "homelander", "weight": 60 },
    { "name": "joker", "weight": 60 },
    { "name": "kill", "weight": 60 },
    { "name": "panther", "weight": 60 },
    { "name": "pink_hoodie", "weight": 60 },
    { "name": "powers", "weight": 60 },
    { "name": "ranger", "weight": 60 },
    { "name": "superhero", "weight": 60 },
    { "name": "toga", "weight": 60 },
    { "name": "tyler_durden", "weight": 60 },

    { "name": "john_mcclane", "weight": 25 },
    { "name": "samurai_armor", "weight": 25 },
    { "name": "shang_tsung", "weight": 25 },
    { "name": "short_circuit", "weight": 25 },
    { "name": "snake", "weight": 25 },
    { "name": "venom", "weight": 25 },

    { "name": "ace", "weight": 10 },
    { "name": "astro", "weight": 10 },
    { "name": "beetle", "weight": 10 },
    { "name": "burned_t", "weight": 10 },
    { "name": "dress", "weight": 10 },
    { "name": "dumb", "weight": 10 },
    { "name": "dumber", "weight": 10 },
    { "name": "freddy", "weight": 10 },
    { "name": "fur_coat", "weight": 10 },
    { "name": "gold_hoodie", "weight": 10 },
    { "name": "hans", "weight": 10 },
    { "name": "insane", "weight": 10 },
    { "name": "lumbergh", "weight": 10 },
    { "name": "rambo", "weight": 10 },
    { "name": "red", "weight": 10 },
    { "name": "robin_hood", "weight": 10 },
    { "name": "wizerd", "weight": 10 }
  ],
  "back": [
    { "name": "none", "weight": 65 },

    { "name": "none", "weight": 80 },

    { "name": "medieval_sword", "weight": 30 },
    { "name": "rpg", "weight": 30 },
    { "name": "shield", "weight": 30 },
    { "name": "wings", "weight": 30 },

    { "name": "fire_wings", "weight": 15 },
    { "name": "robot_arms", "weight": 15 },

    { "name": "gold_wings", "weight": 7 },

    { "name": "angel", "weight": 3 },
    { "name": "devil", "weight": 3 },
    { "name": "katanas", "weight": 3 }
  ]
}
`}>
        </textarea>
        <h3 className={``}>LSP8 metadata generator</h3>

        <div className={`${styles['board']} d-f-c`}>
          <svg ref={SVG} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g ref={backgroundGroupRef} name={`backgroundGroup`} />
            <g ref={backGroupRef} name={`backGroup`} />
            <g ref={baseGroupRef} name={`baseGroup`} />
            <g ref={clothingGroupRef} name={`clothingGroup`} />
            <g ref={headGroupRef} name={`headGroup`} />
            <g ref={mouthGroupRef} name={`mouthGroup`} />
            <g ref={eyesGroupRef} name={`eyesGroup`} />
          </svg>
        </div>
        <div className={`${styles.actions}`}>
        <input type="text" name="autogenerate" id="" placeholder='Auto Generate Number'/>
          <button onClick={() => autoGenerate()}>Auto Generate</button>
          <button style={{marginTop:`1rem`}} onClick={() => generateOne()}>Generate</button>
          <button onClick={() => download()}>Download</button>
          <button onClick={() => upload()}>Upload</button>
          <button onClick={(e) => setData(e)}>setLSP8metadata</button>
        </div>
        <div id={`log`} className={`${styles.log}`}></div>
      </div>
    </>
  )
}

export default App
