import fs from "fs/promises";

const addBill = async (body) => {
  let verRm = JSON.parse(await fs.readFile("roommates.json", "utf8"));
  let datosRm = verRm.roommates;
  let conteoRm = datosRm.length;
  datosRm.map(async (e) => {
    if (e.nombre == body.roommate) {
      let recibe = body.monto / conteoRm;
      e.recibe += parseFloat(recibe.toFixed(2));
    } else if (e.nombre !== body.roommate) {
      let debe = body.monto / conteoRm;
      e.debe += parseFloat(debe.toFixed(2));
    }
    await fs.writeFile("roommates.json", JSON.stringify(verRm));
  });
};

const updateBill = async (body) => {
  let roommate = JSON.parse(await fs.readFile("roommates.json", "utf8"));
  let datosRm = roommate.roommates;
  let conteoRm = datosRm.length;
  const gastosJSON = JSON.parse(await fs.readFile("bills.json", "utf8"));
  gastosJSON.bills.map(async (g) => {
    datosRm.map((e) => {
      if (e.nombre == body.roommate) {
        let recibe;
        recibe = body.monto / conteoRm;
        e.recibe = parseFloat(recibe.toFixed(2));
      } else if (e.nombre !== body.roommate) {
        let nuevoConteo = conteoRm - 1;
        let nuevoGasto = g.monto / conteoRm;
        let debe;
        debe = nuevoGasto;
        e.debe = parseFloat(debe.toFixed(2));
      }
    });
    await fs.writeFile("roommates.json", JSON.stringify(roommate));
  });
};

const deleteBill = async (body) => {
  let roommate = JSON.parse(await fs.readFile("roommates.json", "utf8"));
  let datosRm = roommate.roommates;
  let conteoRm = datosRm.length;
  const gastosJSON = JSON.parse(await fs.readFile("bills.json", "utf8"));
  gastosJSON.bills.map(async (gasto) => {
    datosRm.map((e) => {
      if (e.nombre == body.roommate) {
        let recibe;
        recibe -= body.monto / conteoRm;
        e.recibe = parseFloat(recibe.toFixed(2));
      } else if (e.nombre !== body.roommate) {
        let nuevoConteo = conteoRm - 1;
        let nuevoGasto = -gasto.monto / conteoRm;
        let debe;
        debe = nuevoGasto;
        e.debe = parseFloat(debe.toFixed(2));
      }
    });
    await fs.writeFile("roommates.json", JSON.stringify(roommate));
  });
};
export { addBill, updateBill, deleteBill };
