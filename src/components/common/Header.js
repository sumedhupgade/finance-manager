import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Header = ({ setUser }) => {
  const navigate = useNavigate();
  const [showMenu, setMenu] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user"))
  const logOut = async (e) => {
    try {
      auth.signOut().then((resp) => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/");
        }, 300);
      });
    } catch (error) {}
  };
  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">Finance</span>
            <img
              className="h-8 w-auto"
              src="./assets/img/ft.png"
              alt=""
            />
          </a>
        </div>
        <div className="me-2 ms-auto">{userInfo.username}</div>
        <div className="flex">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMenu(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>
      {showMenu && (
        <div role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/dashboard" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="./assets/img/ft.png"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMenu(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className=" flow-root">
              <div className=" divide-y divide-gray-500/10">
                <div className="space-y-2 py-3">
                    <a
                      href="/" onClick={logOut}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log out
                    </a>
                    <a
                      href="/profile"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                    <a
                      href="/debts"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Debts
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
