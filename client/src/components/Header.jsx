import React, { useState } from "react";
import Search from "./Search";
import { BsCart4 } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/shop.gif";
import { FaRegCircleUser } from "react-icons/fa6";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import useMobile from "../hooks/useMobile";
import { useSelector, useDispatch } from "react-redux";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

export default function Header() {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state.cartItem.cart);
  // const [totalPrice,setTotalPrice] = useState(0)
  // const [totalQty,setTotalQty] = useState(0)
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  // console.log('user from store',user)
  const isSearchPage = location.pathname === "/search";
  const redirectToLoginPage = () => {
    navigate("/login");
  };
  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (user._id) {
      navigate("/user");
    } else {
      navigate("/login");
    }
  };
  // const mobileUser=()=>{
  //   (location.pathname==='/user')? window.history.back()  :handleMobileUser()
  // }

  // console.log(user)

  return (
    <header className="h-20 lg:h-20 lg:shadow-md bg-black sticky top-0 z-40 flex flex-col justify-center gap-1">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={100}
                height={20}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={40}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* User Icon */}

          {/* onClick={()=>window.history.back()}  */}
          {/* onClick={handleMobileUser} */}
          <div>
            <button className="text-neutral-600 lg:hidden">
              <FaRegCircleUser size={26} onClick={handleMobileUser} />
            </button>
          </div>
          {/* desktop */}
          <div className="hidden lg:flex  items-center gap-10">
            {user?._id ? (
              <div className="relative">
                <div
                  onClick={() => setOpenUserMenu((preve) => !preve)}
                  className="flex select-none items-center gap-1 cursor-pointer"
                >
                  <p className="text-white">Account</p>
                  {openUserMenu ? (
                    <GoTriangleUp className="text-white" size={25} />
                  ) : (
                    <GoTriangleDown className="text-white" size={25} />
                  )}
                </div>
                {openUserMenu && (
                  <div className="absolute right-0 top-12">
                    <div className="bg-white rounded px-4 min-w-52 lg:shadow-lg">
                      <UserMenu close={handleCloseUserMenu} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={redirectToLoginPage} className="text-lg text-white px-2">
                Login
              </button>
            )}
         
            <button
              onClick={() => setOpenCartSection(true)}
              className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
            >
              {/**add to card icons */}
              <div className="animate-bounce">
                <BsCart4 size={26} />
              </div>
              <div className="font-semibold text-sm">
                {cartItem[0] ? (
                  <div>
                    <p>{totalQty} Items</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                ) : (
                  <p>My Cart</p>
                )}
              </div>
            </button>
           
          </div>
        </div>
      )}

      {/* Search for Mobile */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
    </header>
  );
}
