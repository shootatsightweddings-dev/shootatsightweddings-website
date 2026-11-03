const { Router } = require('express');
const service = require('../services/contentPageService');
const router = Router();
router.get('/', async (req, res, next) => { try { res.json({success:true,pages:await service.listPages()}); } catch(error) {next(error);} });
router.get('/:kind/:slug', async (req,res,next) => { try { const page=await service.getPage(req.params.kind,req.params.slug); if(!page) return res.status(404).json({success:false,message:'Page not found'}); res.json({success:true,page}); } catch(error){next(error);} });
module.exports = router;
