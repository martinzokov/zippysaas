import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';

const Signout = () => {
  const router = useRouter();
    const signOut = async () =>{
        try {
        await Auth.signOut({ global: true });
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    useEffect(() => {
        signOut().then(() => {
            router.push('/login');
        }).catch(err => {console.log(err)});
    }, []);

  return (<></>)
};

export default Signout;
