import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Skill } from "../models/skillSchema.js";
import ErrorHandler from "../middleware/error.js";
import { v2 as cloudinary } from "cloudinary";

export const addSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Skill Icon/SVG Required", 400));
  }
  const { svg } = req.files;
  const { title, proficiency } = req.body;
  if (!title || !proficiency) {
    return next(new ErrorHandler("Skill Title & Proficiency Required", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    { folder: "PORTFOLIO_SKILLS" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      "Cloudinary Error",
      cloudinaryResponse.error || "Unknown Error"
    );
  }
  const skill = await Skill.create({
    title,
    proficiency,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  skill.save();
  res.status(200).json({
    success: true,
    message: "New Skill Added!",
    skill,
  });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("Skill ID is required", 400));
  }
  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }
  try {
    if (skill.svg && skill.svg.public_id) {
      await cloudinary.uploader.destroy(skill.svg.public_id);
    }
    await skill.deleteOne();
    res.status(200).json({
      success: true,
      message: "Skill Deleted Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
export const getallSkill = catchAsyncErrors(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({
    success: true,
    skills,
  });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("Skill Id is required", 400));
  }
  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }
  const { title, proficiency } = req.body;
  if (!title || !proficiency) {
    return next(new ErrorHandler("Skill Title & Proficiency Required", 400));
  }
  if (req.files && req.files.svg) {
    const { svg } = req.files;
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SKILLS" }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(
        "Cloudinary Error",
        cloudinaryResponse.error || "Unknown Error"
      );
    }
    if (skill.svg && skill.svg.public_id) {
      await cloudinary.uploader.destroy(skill.svg.public_id);
    }
  }
});
