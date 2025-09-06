import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./firebase";

const URL = import.meta.env.VITE_URL;

/**
 * @param {any} data
 */
export async function addDocument(data) {

  try {
    const res = await fetch(URL + 'add-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }), // collection is always inside this data dict.
    });

    return 0;
  } catch (error) {
    console.log(error);
    return -1;
  }
  
}

/**
 * @param {any} collection
 */
export async function getDocuments(collection) {
  try {

    const toSend = {
      "collection": collection
    }

    let res = await fetch(URL + "read-collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({toSend})
    })
    res = await res.json();
    return res;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// @ts-nocheck
/**
 * @param {undefined} [data]
 */
export async function getScrape(data) {
  try {
    console.log(JSON.stringify({data}))
    const res = await fetch(URL + 'scrape-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data })
    });

    console.log(res);

    const resp = await res.json();

    console.log(resp.data);

    return {"status": 0, "data": resp.data};
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// @ts-nocheck
/**
 * @param {undefined} [data]
 */
export async function getAddLocation(data) {
  try {
    console.log(JSON.stringify({data}))
    const res = await fetch(URL + 'add-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data })
    });

    const locId = await res.json();

    console.log(locId);

    // const resp = await res.json();

    // console.log(resp.data);

    return locId.id;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

/**
 * @param {any} folderId
 */
export async function getImage(folderId) {

  const toSend = {
      folderId: folderId
  }

  console.log(toSend);

  const url = URL + 'get-images';

  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'}, // Important to include the headers!
      body: JSON.stringify(toSend)
  });

  const data = await response.json();
  const images = data.images

  return images;

}

/**
 * @param {any} docId
 */
export async function deleteDoc(docId) {
  const toSend = {
    deleteId: docId
  }

  const url = URL + "delete-doc";

  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'}, // Important to include the headers!
      body: JSON.stringify(toSend)
  });

  const data = await response.json();
}

/**
 * @param {any} pass
 */
export async function checkPass(pass) {
  const toSend = {
    checkPass: pass
  }

  const url = URL + "check-pass";

  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'}, // Important to include the headers!
      body: JSON.stringify(toSend)
  });

  const data = await response.json();
  console.log(data, data.status);
  return data.status;
}