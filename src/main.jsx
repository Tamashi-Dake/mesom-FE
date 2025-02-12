import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { ThemeContextProvider } from "./lib/context/themeContext.jsx";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import Notifications from "./pages/Notifications.jsx";
import Search from "./pages/Search.jsx";
import LoginPage from "./pages/Auth.jsx";
import PostPage from "./pages/PostPage.jsx";
import Bookmark from "./pages/Bookmarks.jsx";
import ErrorElement from "./components/skeleton/ErrorElement.jsx";
import Conversations from "./pages/Conversations.jsx";

import "./index.css";
import Conversation from "./components/conversation/Conversation.jsx";
import ConversationInfo from "./components/conversation/ConversationInfo.jsx";
import NewConversation from "./components/conversation/NewConversation.jsx";

// Create a new instance of QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

// Create a new instance of BrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    ),
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/post/:postId",
        element: <PostPage />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/conversations",
        element: <Conversations />,
      },
      {
        path: "/conversation",
        element: <NewConversation />,
      },
      {
        path: "/conversation/:conversationId",
        element: <Conversation />,
      },
      {
        path: "/conversation/:conversationId/info",
        element: <ConversationInfo />,
      },
      {
        path: "/bookmarks",
        element: <Bookmark />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  {
    path: "/auth",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          position: "bottom-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
