"use server";

import { cookies } from "next/headers";

const addComment = async (postId: number, text: string, image?: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    console.log(
      `Adding comment to post ${postId} with text: "${text}" and image: "${
        image || "none"
      }"`
    );

    const response = await fetch("http://localhost:8080/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
        image: image || "",
        session: token,
      }),
      cache: "no-store",
    });

    const data = await response.json();
    console.log(`Add comment response for post ${postId}:`, data);

    if (data.error === "Invalid session") {
      cookieStore.delete("token");
    }

    return data;
  } catch (err) {
    console.error(`Error adding comment to post ${postId}:`, err);
    return { error: "Failed to add comment" };
  }
};

export default addComment;
