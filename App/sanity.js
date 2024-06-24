import { createClient } from "@sanity/client";
import { fetchQuery } from "./utils/supports";

const client = createClient({
  projectId: "iv5jyn1g",
  dataset: "production",
  apiVersion: "2024-04-02",
  useCdn: false, // Ensure fresh data
  token: 'sk3TdoUk03Ay0AIhsnb8rNOrauIXvZIoeyMvy3UuA0I7U3eIFBsnw6pmbuS9QcfuIHnJEDoQ1hUilttO51kAVGmtdzNRYmfV82JUKmT9h2uWbKxEbL9ypsZk651qtSThnsMShmIbu8RFO3ThNal1eLzyJC2Oj0CR3tDc2J91iPdru26CIzIJ',
});

export { client };

const fetchAssets = async () => {
  try {
    const assets = await client.assets.getAll();
    console.log('Assets:', assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
  }
};

export const fetchFeeds = async () => {
  try {
    const feeds = await client.fetch(fetchQuery);
    return feeds;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return [];
  }
};

export const addItem = async (itemData) => {
  try {
    const result = await client.create({
      _type: 'item', // Replace 'item' with your specific type
      ...itemData
    });
    console.log('Item added', result);
    return result;
  } catch (error) {
    console.error('Error adding item', error);
    throw new Error('Failed to add item');
  }
};

export const deleteItem = async (itemId) => {
  try {
    const result = await client.delete(itemId);
    console.log('Item deleted', result);
    return result;
  } catch (error) {
    console.error('Error deleting item', error);
    throw new Error('Failed to delete item');
  }
};

export const updateItem = async (itemId, updatedData) => {
  try {
    const result = await client.patch(itemId).set(updatedData).commit();
    console.log('Item updated', result);
    return result;
  } catch (error) {
    console.error('Error updating item', error);
    throw new Error('Failed to update item');
  }
};