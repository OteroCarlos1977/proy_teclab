const express = require("express");
const respuesta = require("../../red/respuestas");
const controlador = require("./index");
const router = express.Router();

router.get("/", todos);
router.get("/:id", uno);
router.post("/", agregar);
router.put("/", eliminar);

async function todos(req, res, next) {
  try {
    const items = await controlador.todos();
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function uno(req, res, next) {
  try {
    const items = await controlador.uno(req.params.id);
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function agregar(req, res, next) {
    try {
      const items = await controlador.agregar(req.body);

      if(req.body.id == 0) {
        mensaje = 'Registro guardado con éxito';
      }else {
        mensaje = 'Registro actualizado con éxito';
      }
      respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
  }

async function eliminar(req, res, next) {
    try {
      const items = await controlador.eliminar(req.body);
      respuesta.success(req, res, 'Registro eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
  }

module.exports = router;
