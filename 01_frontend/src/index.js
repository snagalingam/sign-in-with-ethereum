import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';


const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();


function createSiweMessage (address, statement) {
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1'
  });
  return message.prepareMessage();
}

async function connectWallet () {
    try {
        console.log('Connecting wallet');
        const accounts = await provider.send('eth_requestAccounts', []);
        console.log('Connected to account ', accounts);
    } catch (error) {
        if (error.code === 4001) {
        // User rejected request
            console.log('User rejected request');
        } 
        else {
            console.log(error);
        }
    }
}

async function signInWithEthereum () {
  const message = createSiweMessage(
      await signer.getAddress(), 
      'Sign in with Ethereum to the app.'
    );
  console.log(await signer.signMessage(message));
}

// Buttons from the HTML page
const connectWalletBtn = document.getElementById('connectWalletBtn');
const siweBtn = document.getElementById('siweBtn');
connectWalletBtn.onclick = connectWallet;
siweBtn.onclick = signInWithEthereum;