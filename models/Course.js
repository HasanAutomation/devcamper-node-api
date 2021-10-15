const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    weeks: {
      type: String,
      required: [true, 'Please add number of weeks'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bootcamp',
    },
  },
  {
    timestamps: true,
  }
);

// static method to calculate average cost
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(
      bootcampId,
      {
        $set: { averageCost: Math.ceil(obj[0].averageCost / 10) * 10 },
        runValidators: true,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
};

CourseSchema.post('save', async function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', async function (next) {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
