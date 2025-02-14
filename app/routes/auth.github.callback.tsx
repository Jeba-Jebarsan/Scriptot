import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import axios from "axios";
import { api } from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { getConvexUrl } from "~/lib/config/environment";

const convex = new ConvexHttpClient(getConvexUrl());

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error('No code received from GitHub');
    return redirect("/?error=github_auth_failed&reason=no_code");
  }

  // Debug log for environment variables
  console.log('Environment check:', {
    hasClientId: !!process.env.VITE_GITHUB_CLIENT_ID,
    hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    hasConvexUrl: !!process.env.VITE_CONVEX_URL
  });

  if (!process.env.VITE_GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error('Missing GitHub credentials');
    return redirect("/?error=github_auth_failed&reason=missing_credentials");
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (tokenResponse.data.error || !tokenResponse.data.access_token) {
      console.error('GitHub token error:', tokenResponse.data);
      return redirect("/?error=github_auth_failed");
    }

    // Get user profile
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    // Get user emails separately
    const emailsResponse = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    // Find primary email
    const primaryEmail = emailsResponse.data.find((email: any) => email.primary)?.email;
    
    if (!primaryEmail) {
      console.error('No primary email found in GitHub response');
      return redirect("/?error=github_auth_failed&reason=no_email");
    }

    const userData: {
      email: string;
      name: string;
      picture: string;
      githubToken: string;
      _id?: string;
    } = {
      email: primaryEmail,
      name: userResponse.data.name || userResponse.data.login,
      picture: userResponse.data.avatar_url,
      githubToken: tokenResponse.data.access_token,
    };

    try {
      const userId = await convex.mutation(api.users.upsertUser, userData);
      userData._id = userId;
    } catch (convexError) {
      console.error('Convex storage error:', convexError);
      return redirect("/?error=github_auth_failed&reason=database");
    }

    const cookieValue = encodeURIComponent(JSON.stringify(userData));
    console.log('Setting cookie with userData:', userData);
    
    return redirect("/?login=success", {
      headers: {
        "Set-Cookie": `userData=${cookieValue}; Path=/; Max-Age=3600; SameSite=Lax`,
      },
    });

  } catch (error) {
    console.error("GitHub auth error:", error);
    return redirect("/?error=github_auth_failed");
  }
};