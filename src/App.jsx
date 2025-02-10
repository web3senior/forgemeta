import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Metadata from './assets/metadata.json'
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
    for (let i = 0; i < 50; i++) {
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
        <h3 className={``}>LSP8 metadata generator</h3>

        <div className={`${styles['board']} d-f-c`}>
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
        <div className={`${styles.actions}`}>
          <button onClick={() => autoGenerate()}>Auto Generate(20)</button>
          <button onClick={() => generateOne()}>Generate</button>
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
