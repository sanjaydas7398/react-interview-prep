const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
    category: { type: String, default: 'React' },
    subCategory: { type: String, default: 'All' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

qaSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('QA', qaSchema);
