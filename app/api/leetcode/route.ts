import { NextResponse } from "next/server";
import { API_CONFIG } from "@/config/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || API_CONFIG.leetcode.username;
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const query = `
    query leetcodeData($username: String!, $limit: Int!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(API_CONFIG.leetcode.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query,
        variables: { username, limit },
      }),
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache response on Next.js server for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`LeetCode GraphQL error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error("LeetCode GraphQL returned errors:", json.errors);
      return NextResponse.json(
        { error: json.errors[0]?.message || "LeetCode GraphQL error" },
        { status: 400 }
      );
    }

    const data = json.data;
    const submitStats = data?.matchedUser?.submitStats?.acSubmissionNum || [];
    const submissions = data?.recentAcSubmissionList || [];

    // Parse stats into a friendlier format
    const stats = {
      all: submitStats.find((s: any) => s.difficulty === "All")?.count || 0,
      easy: submitStats.find((s: any) => s.difficulty === "Easy")?.count || 0,
      medium: submitStats.find((s: any) => s.difficulty === "Medium")?.count || 0,
      hard: submitStats.find((s: any) => s.difficulty === "Hard")?.count || 0,
    };

    return NextResponse.json({ stats, submissions });
  } catch (error: any) {
    console.error("Failed to proxy LeetCode request:", error);
    const message = error.name === "AbortError" ? "Request timed out" : error.message;
    return NextResponse.json(
      { error: message || "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
