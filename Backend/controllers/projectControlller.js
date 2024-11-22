import { Project } from "../models/projectSchema.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { v2 as cloudinary } from "cloudinary";

export const addProject = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    gitRepoLink,
    demoLink,
    stack,
    technologies,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !stack ||
    !technologies ||
    !deployed
  ) {
    return next(new ErrorHandler("Please enter all the fields", 400));
  }
  if (!req.files || !req.files.projectBanner) {
    return next(new ErrorHandler("Please upload a project banner", 400));
  }
  const { projectBanner } = req.files;
  const cloudinaryResponse = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: "PROJECTS" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      "Cloudinary Error",
      cloudinaryResponse.error || "Unknown Error"
    );
  }
  const project = await Project.create({
    title,
    description,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    gitRepoLink,
    demoLink,
    stack,
    technologies,
    deployed,
  });
  project.save();
  res.status(201).json({
    success: true,
    message: "Project added successfully",
    project,
  });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
export const getallProject = catchAsyncErrors(async (req, res, next) => {
  const projects = await Project.find({});
  res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    projects,
  });
});
export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    gitRepoLink,
    demoLink,
    stack,
    technologies,
    deployed,
  } = req.body;
  const newProjectData = {
    title,
    description,
    gitRepoLink,
    demoLink,
    stack,
    technologies,
    deployed,
  };
  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner;
    const project = await Project.findById(id);
    const projectImageId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectImageId);
    const cloudinaryResponseforProject = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PROJECTS" }
    );
    newProjectData.projectBanner = {
      public_id: cloudinaryResponseforProject.public_id,
      url: cloudinaryResponseforProject.secure_url,
    };
  }
  const updateProject = await Project.findByIdAndUpdate(id, newProjectData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project: updateProject,
  });
});
export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        project,
    });
});
