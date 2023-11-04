import { IExecWeb3mail, getWeb3Provider } from "@iexec/web3mail";

const PRIVATE_KEY = "0x491185289d25b93e666b902ceec3677f2eb93c51390e21aa2d40258529819b2b";
// get web3 provider from a private key
const web3Provider = getWeb3Provider(PRIVATE_KEY);
// instantiate
const web3mail = new IExecWeb3mail(web3Provider);


const sendEmail = await web3mail.sendEmail({
    protectedData: '0x29500F62084dB58D086821bf6A1DDFA180651480',
    emailSubject: 'My email subject',
    emailContent: 'My email content'
})
