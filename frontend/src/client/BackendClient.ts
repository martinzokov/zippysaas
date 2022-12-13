import { Auth } from "aws-amplify";
import axios from "axios";
import { getHost } from "./environmentConfig";


const HOSTED_URL = getHost();

axios.interceptors.request.use(async function (config) {
    const token = await getToken()
    config.headers = { Authorization: `Bearer ${token}` }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  export async function createCheckoutSession(priceId: String){
    const response = await axios
      .post(
        `${HOSTED_URL}create-checkout-session?price=${priceId}`,
        {}
      )
      .catch(err=> console.error(err))
    return response
  }

  export async function createPortalSession(){

    return axios
      .post(
        `${HOSTED_URL}create-portal-session`,
        {}
      )
      .catch(err=> console.error(err))
  }

  export async function getSubscriptionDetails(){
    return axios
        .get(`${HOSTED_URL}subscription-details`)
        .catch(err=> console.error(err))
  }


  async function getToken(){
    return await (await Auth.currentSession()).getIdToken().getJwtToken()
  }