import {
  BsBell,
  BsBookmark,
  BsChatDots,
  BsHouse,
  BsPerson,
} from "react-icons/bs";

import { BiCog, BiSearch } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import { FaFeather } from "react-icons/fa6";
import { GrCircleInformation } from "react-icons/gr";

export const routes = [
  {
    name: "Home",
    path: "/",
    icon: <BsHouse size={24} className="text-main-primary" />,
  },
  {
    name: "Search",
    path: "/search",
    icon: <BiSearch size={24} className="text-main-primary" />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <BsBell size={24} className="shrink-0 text-main-primary" />,
  },
  {
    name: "Messages",
    path: "/conversations",
    icon: <BsChatDots size={24} className="text-main-primary" />,
  },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    icon: <BsBookmark size={24} className="text-main-primary" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <BsPerson size={24} className="text-main-primary" />,
  },
];

export const mobileRoutes = [
  {
    name: "Profile",
    path: "/profile",
    icon: <BsPerson size={24} className="text-main-primary" />,
  },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    icon: <BsBookmark size={24} className="text-main-primary" />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <BsBell size={24} className="shrink-0 text-main-primary" />,
  },
  {
    name: "Messages",
    path: "/conversations",
    icon: <BsChatDots size={24} className="text-main-primary" />,
  },
  {
    name: "Search",
    path: "/search",
    icon: <BiSearch size={24} className="text-main-primary" />,
  },
  {
    name: "About Mesom",
    path: "/about",
    icon: <GrCircleInformation size={24} className="text-main-primary" />,
  },
  // {
  //   name: "Settings and Privacy",
  //   path: "/settings",
  //   icon: <BiCog size={24} className="text-main-primary" />,
  // },
];

// TODO: Move to component => add userid in param
export const config = {
  "/profile": {
    title: "Messages",
    icon: <CiMail size={24} color="white" />,
  },
  "/": {
    title: "Create Post",
    icon: <FaFeather size={24} color="white" />,
  },
};

export const gridImages = [
  "grid-cols-1", // for 1 image
  "grid-cols-2", // for 2 images
  // TODO: change fixed height
  "grid-rows-2 grid-cols-2 max-h-60", // for 3 images
  "grid-rows-2 grid-cols-2 max-h-60", // for 4 images
];

// Backdrop variant for fade-in effect
export const backdropVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Modal variant with scale effect
export const modalVariant = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", duration: 0.5, bounce: 0.4 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

export const popupVariant = {
  initial: { opacity: 0, y: -25 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.4 },
  },
  exit: { opacity: 0, y: -25, transition: { duration: 0.2 } },
};
