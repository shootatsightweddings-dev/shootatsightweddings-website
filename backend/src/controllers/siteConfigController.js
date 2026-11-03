const siteConfigService = require('../services/siteConfigService');

const getSiteConfig = async (req, res, next) => {
  try {
    const config = await siteConfigService.getSiteConfig();
    res.json({ success: true, config });
  } catch (err) {
    next(err);
  }
};

const updateSectionConfig = async (req, res, next) => {
  try {
    const section = await siteConfigService.updateSectionConfig(req.params.sectionKey, req.body);
    res.json({ success: true, section });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSiteConfig,
  updateSectionConfig
};
