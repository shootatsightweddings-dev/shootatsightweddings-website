const { Router } = require('express');
const { getSiteConfig } = require('../controllers/siteConfigController');

const router = Router();

router.get('/', getSiteConfig);

module.exports = router;
