import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, recipeData = undefined) {
  try {
    const fetchPro = recipeData
      ? await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(recipeData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    let data = await res.json();

    if (!res.ok) throw new Error(`${data.message}  ${res.status}`);

    return data;
  } catch (e) {
    throw e;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

//     let data = await res.json();

//     if (!res.ok) throw new Error(`${data.message}  ${res.status}`);

//     return data;
//   } catch (e) {
//     throw e;
//   }
// };

// export const sendJSON = async function (url, recipeData) {
//   try {
//     const fetchPro = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(recipeData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     let data = await res.json();

//     if (!res.ok) throw new Error(`${data.message}  ${res.status}`);

//     return data;
//   } catch (e) {
//     throw e;
//   }
// };
