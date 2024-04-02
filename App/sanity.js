import { createClient } from "@sanity/client";
import { fetchQuery } from "./utils/supports";

const client = createClient({
  projectId: "iv5jyn1g",
  dataset: "production",
  apiVersion: "2024-04-02",
  useCdn: true,
});

export const fetchFeeds = async () => {
    let data = await client.fetch(fetchQuery).then((feeds) => {
      return feeds;
    });
    return data;
  };