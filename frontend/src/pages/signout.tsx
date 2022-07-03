import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Signout = () => {
  const router = useRouter();
  const signOut = async () =>{
    try {
      await Auth.signOut();
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
