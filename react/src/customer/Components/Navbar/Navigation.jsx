import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { navigation } from "../../../config/navigationMenu";
import AuthModal from "../Auth/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { deepPurple } from "@mui/material/colors";
import { getUser, logout } from "../../../Redux/Auth/Action";
import { getCart } from "../../../Redux/Customers/Cart/Action";
import { searchProduct } from "../../../Redux/Customers/Product/Action";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, cart } = useSelector((store) => store);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { customersProduct } = useSelector((store) => store);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getCart(jwt));
    }
  }, [jwt]);

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchProduct(searchTerm));
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  const handleOpen = () => setOpenAuthModal(true);
  const handleClose = () => {
    setOpenAuthModal(false);
    if (location.pathname === "/login" || location.pathname === "/register") {
      navigate("/");
    }
  };

  const handleCategoryClick = (category, section, item, close) => {
    navigate(`/${category.id}/${section.id}/${item.id}`);
    close();
  };

  useEffect(() => {
    if (auth.user) {
      setOpenAuthModal(false);
      if (location.pathname === "/login" || location.pathname === "/register") {
        navigate("/");
      }
    } else {
      if (location.pathname === "/login" || location.pathname === "/register") {
        setOpenAuthModal(true);
      } else {
        setOpenAuthModal(false);
      }
    }
  }, [location.pathname, auth.user, navigate]);

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
  };

  const handleMyOrderClick = () => {
    handleCloseUserMenu();
    auth.user?.role === "ROLE_ADMIN"
      ? navigate("/admin")
      : navigate("/account/order");
  };

  return (
    <div className="bg-white pb-10">
      {/* Mobile Drawer */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                {/* Drawer header */}
                <div className="flex px-4 pb-2 pt-5 justify-between items-center border-b border-gray-200">
                  <span className="font-bold text-gray-800 text-base">Menu</span>
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="relative flex items-center border rounded-md px-3 py-2">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="outline-none ml-2 bg-transparent text-sm w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (searchTerm.trim()) {
                            navigate(`/products/search?q=${encodeURIComponent(searchTerm.trim())}`);
                            setSearchTerm("");
                            setOpen(false);
                          }
                        }
                      }}
                    />
                  </div>
                  {searchTerm && Array.isArray(customersProduct.searchProducts) && customersProduct.searchProducts.length > 0 && (
                    <div className="mt-2 border shadow-lg rounded-md bg-white max-h-48 overflow-y-auto">
                      {customersProduct.searchProducts.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer flex items-center border-b last:border-b-0"
                          onClick={() => {
                            setSearchTerm("");
                            setOpen(false);
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          <img src={product.imageUrl} alt={product.title} className="w-8 h-8 object-cover rounded mr-2" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-gray-900 truncate">{product.title}</span>
                            <span className="text-xs text-gray-500">₹{product.discountedPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Tabs */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-10 px-4 pb-8 pt-10"
                      >
                        <div className="grid grid-cols-2 gap-x-4">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative text-sm">
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                              </div>
                              <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">Shop now</p>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={section.name}>
                            <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                              {section.name}
                            </p>
                            <ul role="list" aria-labelledby={`${category.id}-${section.id}-heading-mobile`} className="mt-6 flex flex-col space-y-6">
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <p
                                    onClick={() => handleCategoryClick(category, section, item, () => setOpen(false))}
                                    className="-m-2 block p-2 text-gray-500 cursor-pointer hover:text-gray-800"
                                  >
                                    {item.name}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">{page.name}</a>
                    </div>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="space-y-4 border-t border-gray-200 px-4 py-6">
                  {auth.user ? (
                    <>
                      <p className="font-medium text-gray-900">Hi, {auth.user?.firstName}</p>
                      <button onClick={() => { handleMyOrderClick(); setOpen(false); }} className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                        {auth.user?.role === "ROLE_ADMIN" ? "Admin Dashboard" : "My Orders"}
                      </button>
                      <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left text-sm text-red-500 hover:text-red-700 py-1">
                        Logout
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { handleOpen(); setOpen(false); }} className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-xs sm:text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over ₹1000
        </p>

        <nav aria-label="Top" className="mx-auto">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center px-4 sm:px-6 lg:px-11">
              {/* Hamburger */}
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-2 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Shop With Zosh</span>
                  <img
                    src="https://res.cloudinary.com/ddkso1wxi/image/upload/v1675919455/Logo/Copy_of_Zosh_Academy_nblljp.png"
                    alt="Shopwithzosh"
                    className="h-8 w-8 mr-2"
                  />
                </Link>
              </div>

              {/* Desktop flyout */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch z-10">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category.featured.map((item) => (
                                        <div key={item.name} className="group relative text-base sm:text-sm">
                                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                            <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                                          </div>
                                          <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                            <span className="absolute inset-0 z-10" aria-hidden="true" />
                                            {item.name}
                                          </a>
                                          <p aria-hidden="true" className="mt-1">Shop now</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                            {section.name}
                                          </p>
                                          <ul role="list" aria-labelledby={`${section.name}-heading`} className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                            {section.items.map((item) => (
                                              <li key={item.name} className="flex">
                                                <p
                                                  onClick={() => handleCategoryClick(category, section, item, close)}
                                                  className="cursor-pointer hover:text-gray-800"
                                                >
                                                  {item.name}
                                                </p>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              {/* Right actions - always visible */}
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                {/* Desktop auth only */}
                <div className="hidden lg:flex lg:items-center lg:space-x-6">
                  {auth.user ? (
                    <div>
                      <Avatar
                        className="text-white"
                        onClick={handleUserClick}
                        aria-controls={openUserMenu ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openUserMenu ? "true" : undefined}
                        sx={{ bgcolor: deepPurple[500], color: "white", cursor: "pointer" }}
                      >
                        {auth.user?.firstName?.[0]?.toUpperCase()}
                      </Avatar>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openUserMenu}
                        onClose={handleCloseUserMenu}
                        MenuListProps={{ "aria-labelledby": "basic-button" }}
                      >
                        <MenuItem onClick={handleMyOrderClick}>
                          {auth.user?.role === "ROLE_ADMIN" ? "Admin Dashboard" : "My Orders"}
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </div>
                  ) : (
                    <Button onClick={handleOpen} className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      Signin
                    </Button>
                  )}
                </div>

                {/* Desktop search only */}
                <div className="hidden lg:flex items-center relative">
                  <div className="relative border rounded-md px-2 py-1 flex items-center group">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="outline-none ml-2 bg-transparent text-sm w-32 focus:w-48 transition-all duration-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (searchTerm.trim()) {
                            navigate(`/products/search?q=${encodeURIComponent(searchTerm.trim())}`);
                            setSearchTerm("");
                          }
                        }
                      }}
                    />
                  </div>
                  {searchTerm && Array.isArray(customersProduct.searchProducts) && customersProduct.searchProducts.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border shadow-lg rounded-md z-50">
                      {customersProduct.searchProducts.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center border-b last:border-b-0"
                          onClick={() => { setSearchTerm(""); navigate(`/product/${product.id}`); }}
                        >
                          <img src={product.imageUrl} alt={product.title} className="w-10 h-10 object-cover rounded mr-3" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-gray-900 truncate">{product.title}</span>
                            <span className="text-xs text-gray-500">₹{product.discountedPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Wishlist — always visible */}
                <button
                  onClick={() => navigate("/wishlist")}
                  className="p-1 text-gray-600 hover:text-gray-900"
                  aria-label="Wishlist"
                >
                  <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                </button>

                {/* Cart — always visible */}
                <button
                  onClick={() => navigate("/cart")}
                  className="p-1 flex items-center text-gray-600 hover:text-gray-900"
                  aria-label="Cart"
                >
                  <ShoppingBagIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span className="ml-1 text-sm font-medium text-gray-700">
                    {cart.cart?.totalItem || 0}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <AuthModal handleClose={handleClose} open={openAuthModal} />
    </div>
  );
}
