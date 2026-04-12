require("dotenv").config();

console.log("TOKEN:", process.env.MP_ACCESS_TOKEN);

const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 reemplazá esto después con tu access token real
const client = new mercadopago.MercadoPagoConfig({
  accessToken:process.env.MP_ACCESS_TOKEN
});

app.post("/crear-preferencia", async (req, res) => {
  try {
    const {carrito, cliente} = req.body;
    
    console.log("CLIENTE:", cliente);
    console.log("CARRITO:", carrito);

    const items = carrito.map(producto => ({
      title: `${producto.nombre} (Talle: ${producto.talle})`,
      quantity: 1,
      unit_price: producto.precio,
      currency_id: "ARS",
      description: "Producto de Tienda Mely"
    }));

    const preference = {
      items,
    };

    const preferenceClient = new mercadopago.Preference(client);

const respuesta = await preferenceClient.create({
  body: preference
});

    res.json({ init_point: respuesta.init_point });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear pago");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});