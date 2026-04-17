import { createBrowserRouter, Outlet } from "react-router-dom";

import { AppProviders } from "./providers";

import App from "../App";
import Home from "../modules/posts/pages/HomePage";
import Profile from "../modules/profile/pages/ProfilePage";
import About from "../pages/About";
import Notifications from "../modules/notifications/pages/NotificationsPage";
import Search from "../modules/search/pages/SearchPage";
import LoginPage from "../modules/auth/pages/AuthPage";
import PostPage from "../modules/posts/pages/PostPage";
import Bookmark from "../modules/posts/pages/BookmarksPage";
import ErrorElement from "../components/skeleton/ErrorElement";
import Conversations from "../modules/conversations/pages/ConversationsPage";
import Conversation from "../modules/conversations/pages/ConversationPage";
import ConversationInfo from "../modules/conversations/components/ConversationInfo";
import NewConversation from "../modules/conversations/pages/NewConversationPage";

const router = createBrowserRouter([
  {
    element: (
      <AppProviders>
        <Outlet />
      </AppProviders>
    ),
    children: [
      {
        path: "/",
        element: <App />,
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
    ],
  },
]);

export default router;
