const express = require('express');
const router = express.Router()
const CrudControllers = require('../controllers/crudControllers')
const auth = require('../middleware/auth.js');


router.get('/api/getItems',auth,CrudControllers.getItems )
router.post('/api/postItems',auth,CrudControllers.postItems )
router.delete('/api/deleteItems/:id',auth,CrudControllers.deleteItems)
router.put('/api/updateItems/:id',auth,CrudControllers.updateItems)




module.exports = router
