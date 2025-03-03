<<<<<<< HEAD
import { useStore } from '@nanostores/react';
import type { LinksFunction } from '@remix-run/cloudflare';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindReset from '@unocss/reset/tailwind-compat.css?url';
import { stripIndents } from './utils/stripIndent';
import { createHead } from 'remix-island';
import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css?url';
import { ConvexProviderWrapper } from '~/lib/providers/ConvexProvider';
import { json } from '@remix-run/cloudflare';
import type { LoaderFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { createClient } from '@supabase/supabase-js'
=======
import { useStore } from "@nanostores/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import tailwindReset from "@unocss/reset/tailwind-compat.css?url";
import { stripIndents } from "./utils/stripIndent";
import { createHead } from "remix-island";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import reactToastifyStyles from "react-toastify/dist/ReactToastify.css?url";
import { ConvexProviderWrapper } from "~/lib/providers/ConvexProvider";
import { json } from "@remix-run/cloudflare";
>>>>>>> my-lost-branch

import globalStyles from "./styles/index.scss?url";
import xtermStyles from "@xterm/xterm/css/xterm.css?url";

import "virtual:uno.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "stylesheet", href: reactToastifyStyles },
  { rel: "stylesheet", href: tailwindReset },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: xtermStyles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
];

const inlineThemeCode = stripIndents`
  setTutorialKitTheme();
  function setTutorialKitTheme() {
    let theme = localStorage.getItem('bolt_theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }
`;

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
    <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }} />
  </>
));

import { themeStore } from "./lib/stores/theme";
import { logStore } from "./lib/stores/logs";

type LoaderData = {
  ENV: {
<<<<<<< HEAD
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
=======
    GITHUB_CLIENT_ID: string;
    CONVEX_URL: string;
>>>>>>> my-lost-branch
  };
};

export const loader: LoaderFunction = async () => {
  return json({
    ENV: {
<<<<<<< HEAD
      SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
=======
      GITHUB_CLIENT_ID: process.env.VITE_GITHUB_CLIENT_ID || "Ov23liA3PwvOtkwYOKUy",
      CONVEX_URL: process.env.VITE_CONVEX_URL,
>>>>>>> my-lost-branch
    },
  });
};

export default function App() {
  const { ENV } = useLoaderData<LoaderData>();
  const theme = useStore(themeStore);

  useEffect(() => {
    logStore.logSystem("Application initialized", {
      theme,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ConvexProviderWrapper>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <script dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(ENV)}` }} />
          <LiveReload />
          <ToastContainer position="bottom-right" theme="dark" />
        </ConvexProviderWrapper>
      </body>
    </html>
  );
}
<<<<<<< HEAD
=======

// SIGN-OUT FUNCTION WITH CONFIRMATION TOAST
export const handleSignOut = () => {
  toast.info(
    ({ closeToast }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">Do you really want to sign out?</span>
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={() => closeToast()}
            className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition"
          >
            No
          </button>
          <button
            onClick={() => {
              closeToast();
              signOutUser();
            }}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Yes
          </button>
        </div>
      </div>
    ),
    {
      position: "bottom-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
};

const signOutUser = async () => {
  localStorage.removeItem("user");
  await fetch("/api/signout", { method: "POST" }); // Adjust based on your auth system
  window.location.reload();
};
>>>>>>> my-lost-branch
