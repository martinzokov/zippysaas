import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { AppConfig } from "@/utils/AppConfig";

import logo from "../../public/assets/images/zippy-logo.png";
console.log(logo);
type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};
const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];
const userNavigation = [
  { name: "Settings", href: "/settings" },
  { name: "Sign out", href: "/signout" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const Main = (props: IMainProps) => {
  return (
    <div className="w-full px-1 text-gray-700 antialiased bg-gray-100">
      {props.meta}
      <div className="mx-auto max-w-screen-md flex flex-col h-screen justify-between p-3">
        <div className="border-b border-gray-300">
          <div className="pt-16 pb-8">
            <div className="text-3xl font-bold text-gray-900 flex flex-row items-center">
              <div className="w-24">
                <img src={logo.src} alt="logo" />
              </div>
              {AppConfig.title}
            </div>
            <div className="text-xl">{AppConfig.description}</div>
          </div>
          <Disclosure as="nav" className="">
            <>
              <div className="max-w-7xl mx-auto ">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="hidden md:block">
                      <div className="flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <a className="text-gray-900 hover:bg-main hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                              {item.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none">
                            <span className="sr-only">Open user menu</span>
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                              <svg
                                className="absolute w-12 h-12 text-gray-400 -left-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                <Link key={item.name} href={item.href}>
                                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    {item.name}
                                  </a>
                                </Link>
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-main inline-flex items-center justify-center p-2 rounded-md text-main-dark hover:text-main hover:bg-main-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a className="block text-gray-900 hover:bg-main hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0 relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <svg
                        className="absolute w-12 h-12 text-gray-400 -left-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-900">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userNavigation.map((item) => (
                      // <Disclosure.Button
                      //   key={item.name}
                      //   as="a"
                      //   href={item.href}
                      //   className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      // >
                      //   {item.name}
                      // </Disclosure.Button>
                      <Link key={item.name} href={item.href}>
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          </Disclosure>
        </div>

        <div className="content py-5 text-xl mb-auto">{props.children}</div>

        <div className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}.
        </div>
      </div>
    </div>
  );
};

export { Main };
