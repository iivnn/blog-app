const express = require('express')
const router = express.Router()

router.get('/example', (req,res) => {
    res.send("...")
})

module.exports = router
