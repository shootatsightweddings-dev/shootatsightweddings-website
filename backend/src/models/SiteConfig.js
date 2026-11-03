const { Schema, model } = require('mongoose');

const siteConfigSchema = new Schema(
  {
    sectionKey: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = model('SiteConfig', siteConfigSchema);
