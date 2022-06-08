import fs from "fs";


const getFile = async (nameFile) => {
  new Promise((resolve, reject) => {
    fs.readFile(nameFile, "utf8", (err, data) => {
      if (err) reject(console.log("Error Get: ", err));
      resolve(data);
    });
  });
};

const saveFile = async (nameFile, contentFile) => {
  new Promise((resolve, reject) => {
    fs.writeFile(nameFile, contentFile, (err) => {
      if (err) reject(console.log("Error Save: ", err));
      resolve();
    });
  });
};

export { getFile, saveFile };
