import {Schema, model} from "mongoose";

const noticeSchema = Schema(
{
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    noticeTitle: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: [500, "Notice title cannot exceed 100 characters"],
    },
    noticeDetails: {
      type: String,
      required: [true, "Notice details are required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're manually handling createdAt/updatedAt
    versionKey: false, // Disable the __v field
  }
);

// Update the updatedAt field before saving
noticeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

noticeSchema.post("save", function (error, doc, next) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      next(new Error(JSON.stringify(errors)));
    } else {
      next(error);
    }
  });
  
  const Notice = model("Notice", noticeSchema);
  
  export default Notice;