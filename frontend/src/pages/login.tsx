import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const googleSignin = async () =>{
    let result = await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
    console.log(result);
  }
  const emailSignin = async () =>{
    try {
      await Auth.signIn(email, password);
      router.push('/');
    } catch (error) {
        console.log('error signing in', error);
    }
  }

  const handleEmailChange=(e)=>{
    setEmail(e.target.value)
  }
  
  const handlePasswordChange=(e)=>{
    setPassword(e.target.value)
  }
  return (//<Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
          <div>
            <button onClick={googleSignin} aria-label="Continue with google" role="button" className="py-2 px-4 border rounded-lg border-gray-400 hover:border-gray-500 flex items-center w-full mt-10">
                <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google"/>
                <p className="text-base font-medium ml-4 text-gray-700">Continue with Google</p>
            </button>
          </div>
    
        <div className="relative flex my-1 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input onChange={handleEmailChange} id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input onChange={handlePasswordChange} id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"/>
            </div>
          </div>
          <div>
            <button onClick={emailSignin} type="button" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
          <div className="flex text-center items-center">
            <Link href="/forgotten-password">
              <a className="font-small text-sm underline text-neutral-600 hover:text-indigo-500"> Forgot your password? </a>
            </Link>
          </div>
    
    
        </form>
      </div>
  </div>
  //</Main>)
  )
};

export default Login;
