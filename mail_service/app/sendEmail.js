import { IExecWeb3mail, getWeb3Provider } from "@iexec/web3mail";

// Get the command-line argument as a JSON string
const jsonDict = process.argv[2];
const dict = JSON.parse(jsonDict);

const PRIVATE_KEY = dict.privateKey;

// get web3 provider from a private key
const web3Provider = getWeb3Provider(PRIVATE_KEY);
// instantiate
const web3mail = new IExecWeb3mail(web3Provider);

const sendEmail = await web3mail.sendEmail({
    protectedData: dict.addresses,
    emailSubject: dict.emailSubject,
    emailContent: dict.emailContent
})
