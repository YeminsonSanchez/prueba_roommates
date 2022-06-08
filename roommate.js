import axios from "axios";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const newUser = async () => {
  const datos = await axios("https://randomuser.me/api");
  const user = datos.data.results[0];
  const roommate = {
    id: uuidv4().slice(30),
    correo: user.email,
    nombre: `${user.name.first} ${user.name.last}`,
    debe: 0,
    recibe: 0,
  };
  return roommate;
};
const saveUser = async (roommates) => {
  const readData = await fs.readFile("roommates.json", "utf8");
  const partiJSON = JSON.parse(readData);
  partiJSON.roommates.push(roommates);
  await fs.writeFile("roommates.json", JSON.stringify(partiJSON));
};

export { newUser, saveUser };
