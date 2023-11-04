import axios from "axios";
export const postArticle = async ({ url, walletAddress}: {url: string, walletAddress: string}) => {
    return axios.post('http://localhost:8000/articles', {url, address: walletAddress })
}
