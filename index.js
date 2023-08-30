const express = require("express");
const app = express();
require("dotenv").config();
let http = require("http").Server(app);
const io = require("socket.io")(http);
let crypto = require("crypto");

const port = process.env.port || 8000;

let data = require("./data.json");
require("./config/mongoose");
let Data = require("./models/data");

const algo = "aes-256-cbc";
//private key
const key = "hello-this-socket-io-project-enc";

//initial vector random 16 digit

const iv = crypto.randomBytes(16);

const base64data = Buffer.from(iv, "binary").toString("base64");

const originalData = Buffer.from(base64data, "base64");

let i = 0;

io.on("connection", async (socket) => {
  let str = "";

  for (let i = 0; i < data.cities.length; i++) {
    let city = data.cities[i];
    let name = data.names[i];
    let secret_key = crypto
      .createHash("sha256", "sanjay")
      .update(name, city)
      .digest("hex");

    const cipher = crypto.createCipheriv(algo, key, iv);
    let encyptedData = cipher.update(
      JSON.stringify({ name, city, secret_key }),
      "utf-8",
      "hex"
    );
    encyptedData += cipher.final("hex");

    str = str + encyptedData + "|";
  }

  let id = setInterval(() => {
    let index = str.indexOf("|");
    let send = str.substring(0, index);
    str = str.slice(index + 1);

    if (str.length === 0) {
      clearInterval(id);
    }

    socket.emit("send", { encrypt: send });
  }, 1000 * 10);

  socket.on("send_back", async (message) => {
    let DecryptData = [];
    const dicipher = crypto.createDecipheriv(algo, key, originalData);
    let decrypt = dicipher.update(message.encrypt, "hex", "utf-8");
    decrypt += dicipher.final("utf-8");

    let temp = JSON.parse(decrypt);

    //  socket.emit("data",temp);

    try {
      let user = await Data.findOne({ name: temp.name });
      if (!user) {
        await Data.create({
          name: temp.name,
          city: temp.city,
          secret_key: temp.secret_key,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  try {
    let user = await Data.find({});
    for (let i = 0; i < user.length; i++) {
      socket.emit("data", {
        name: user[i].name,
        city: user[i].city,
        secret_key: user[i].secret_key,
      });
    }
  } catch (err) {
    console.log(err);
  }

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

app.use(express.static("./assets"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  //convert the initialization vector to abse64 string

  return res.render("index");
});

http.listen(port, function (err) {
  if (err) {
    console.log(err);
  }

  console.log("Server running on port:", port);
});
