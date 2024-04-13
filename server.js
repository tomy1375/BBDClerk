import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';

dotenv.config();

// Verificación de la carga de variables de entorno
console.log('CLERK_WEBHOOK_SECRET_KEY:', process.env.CLERK_WEBHOOK_SECRET_KEY);
console.log('PORT:', process.env.PORT);

const app = express();

app.use(cors());

// Real code
app.post(
 '/api/webhook',
 bodyParser.raw({ type: 'application/json' }),
 async function (req, res) {
    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
      const evt = wh.verify(payloadString, svixHeaders);
      const { id, ...attributes } = evt.data;
      // Handle the webhooks
      const eventType = evt.type;
      if (eventType === 'user.created') {
        console.log(`User ${id} was ${eventType}`);
        console.log(attributes);
      }
      res.status(200).json({
        success: true,
        message: 'Webhook received',
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
 }
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
 console.log(`Listening on port http://localhost:${port}`);
});
