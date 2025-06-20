"use server";

import { cookies } from "next/headers";

const addPostShare = async (postId: number, userId: number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    const response = await fetch("http://localhost:8080/addPostShare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify({
        postId: postId,
        userId: userId,
        session: token,
      }),
      cache: "no-store",
    });

    const data = await response.json();
    console.log(
      `addPostShare response for post ${postId}, user ${userId}:`,
      data
    );

    if (data.error === "Invalid session") {
      cookieStore.delete("token");
      return { error: "Invalid session" };
    }

    return data;
  } catch (err) {
    console.error(
      `Error adding post share for post ${postId}, user ${userId}:`,
      err
    );
    return { error: "Failed to add post share" };
  }
};

export default addPostShare;
