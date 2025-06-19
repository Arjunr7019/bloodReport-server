const express = require("express");
const {addNewParamaeter,deleteParameterData} = require("../Controllers/parameterDataController");

const router = express.Router();

router.post("/addNewParamaeter", addNewParamaeter);
router.post("/DeleteData", deleteParameterData);

module.exports = router;