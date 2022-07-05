import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';

const Settings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    
  const handleOldPasswordChange=(e)=>{
    setOldPassword(e.target.value)
  }
  
  const handleNewPasswordChange=(e)=>{
    setnewPassword(e.target.value)
  }
  
  const handleConfirmPasswordChange=(e)=>{
    setConfirmPassword(e.target.value)
  }

  const changePassword = async (e) =>{
    e.preventDefault();
    await Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, oldPassword, newPassword);
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  return (
    <Main
    meta={
      <Meta
        title="Next.js Boilerplate Presentation"
        description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
      />
    }
  >
    
    <form onSubmit={changePassword} className="mt-8 space-y-6" method="POST">
        <div className="flex md:flex-row flex-col p-5 content-between">
            <div className="w-full md:w-56">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Change password</h3>
            </div>

            <div className="w-full">    
                    <div className="rounded-md -space-y-px">
                        <div className="w-72">
                            <label htmlFor="old-password" className="text-sm font-medium text-gray-900">
                                Old password
                            </label>
                            <input
                                type="password"
                                name="old-password"
                                id="old-password"
                                autoComplete="current-password"
                                required
                                onChange={handleOldPasswordChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div className="w-72">
                            <label htmlFor="first-name" className="text-sm font-medium text-gray-900">
                                New password
                            </label>
                            <input
                                type="password"
                                name="new-password"
                                id="new-password"
                                autoComplete="new-password"
                                required
                                onChange={handleNewPasswordChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div className="w-72">
                            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">
                                Confirm new password
                            </label>
                            <input
                                type="password"
                                name="confirm-password"
                                id="confirm-password"
                                autoComplete="new-password"
                                required
                                onChange={handleConfirmPasswordChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="w-56 mt-5">
                        <button  type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        Change password
                        </button>
                    </div>
            </div>
        </div>
    </form>
  </Main>)
};

export default Settings;
