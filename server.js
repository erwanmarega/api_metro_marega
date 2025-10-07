"use strict";

const e = require('express');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');



const SwaggerOptions = {
    definition: {
        openapi: "3.0.0", 
        info: {
          title: "API Documentation",
          version: "1.0.0",
          description: "Documentation de l'API avec Swagger",
        },
        servers: [
          {
            url: "http://localhost:3000", 
          },
        ],
      },
      apis: ["./routes/*.js", "./server.js"],

};

const swaggerSpec = swaggerJsdoc(SwaggerOptions);



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use (express.json());

const stationsRouter = require('./routes/stations')
const metroRouter = require('./routes/metro')

app.use('/stations', stationsRouter);
app.use('/', metroRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check de l'API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: L'API fonctionne correctement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   example: "2025-10-07T10:30:00.000Z"
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }

);

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Retourne un message de bienvenue
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello Swagger!
 */
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello Swagger!" });
  });

// Export de l'app pour les tests
module.exports = app;
