import * as http from "http";
import fs from "fs/promises";
import { newUser, saveUser } from "./roommate.js";
import { addBill, updateBill, deleteBill } from "./bills.js";
import { v4 as uuidv4 } from "uuid";
import url from "url";
import sendingEmails from "./mailer.js";


const PORT = 3000;

http
  .createServer(async (req, res) => {
    if (req.url === "/" && req.method === "GET") {
      res.setHeader("content-type", "utf-8", "text/html");
      res.end(await fs.readFile("./index.html", "utf-8"));
    }
    // se extrea data de archivo .json

    const data = async () => {
      try {
        await fs.readFile("roommates.json", { encoding: "utf8" });
      } catch (err) {
        console.log(err);
      }
    };

    if (req.url == "/roommates" && req.method === "GET") {
      res.setHeader("content-type", "application/json");
      res.end(await fs.readFile("roommates.json", "utf8"));
    }
    if (req.url.startsWith("/roommate") && req.method == "POST") {
      res.setHeader("content-type", "application/json");
      newUser()
        .then((roommate) => {
          saveUser(roommate);
          res.writeHead(201).end(JSON.stringify(roommate));
        })
        .catch((e) => {
          res.writeHead(500).end("Error agregando usuario usuario", e);
        });
    }
    let databills = await fs.readFile("bills.json", "utf8");
    let billsJSON = JSON.parse(databills);
    let bills = billsJSON.bills;
    let roommates = await fs.readFile("roommates.json", "utf8");
    let roommatesJSON = JSON.parse(roommates);

    if (req.url.startsWith("/gastos") && req.method == "GET") {
      res.end(JSON.stringify(billsJSON));
    }
    if (req.url.startsWith("/gasto") && req.method == "POST") {
      let data = "";
      req.on("data", (payload) => {
        data += payload;
      });
      req.on("end", async () => {
        let body = JSON.parse(data);
        let bill = {
          id: uuidv4().slice(30),
          roommate: body.roommate,
          descripcion: body.descripcion,
          monto: body.monto,
        };
        bills.push(bill);
        addBill(body);
        let roommate = JSON.parse(await fs.readFile("roommates.json", "utf8"));
        let datosRm = roommate.roommates;
        let nombre = bills.map((r) => r.roommate);
        let descripcion = bills.map((r) => r.descripcion);
        let monto = bills.map((r) => r.monto);
        let correos = datosRm.map((r) => r.correo);
        let text = `hola ${nombre} te informamos que se ha registrado un nuevo gasto en tu cuenta, por un monto de ${monto} por la descripcion ${descripcion}`;
        sendingEmails(correos, "nuevo gasto", text);
        await fs.writeFile("bills.json", JSON.stringify(billsJSON));
        res.writeHead(201).end("Gastos creados!");
      });
    }
    if (req.url.startsWith("/gasto") && req.method == "PUT") {
      let data = "";
      const { id } = url.parse(req.url, true).query;
      req.on("data", (payload) => {
        data += payload;
      });
      req.on("end", async () => {
        let body = JSON.parse(data);
        body.id = id;
        updateBill(body);
        billsJSON.bills = bills.map((g) => {
          if (g.id == body.id) {
            return body;
          }
          return g;
        });
        await fs.writeFile("bills.json", JSON.stringify(billsJSON), (err) => {
          err ? console.log("Error en ingreso de gastos") : console.log("Ok");
        });
        res.writeHead(201).end("Gastos actualizados!");
      });
    }
    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;
      billsJSON.bills = bills.filter((gasto) => {
        if (gasto.id == id) {
          deleteBill(gasto);
        }
      });
      await fs.writeFile("bills.json", JSON.stringify(billsJSON));
      res.writeHead(200).end("Gasto borrado exitosamente!");
    }
  })
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
