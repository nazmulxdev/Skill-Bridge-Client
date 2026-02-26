"use server";

import { adminService } from "@/services/admin.service";
import { Status } from "@/types";
import { revalidateTag } from "next/cache";

// get all users
export const getAllUsersByAdmin = async () => {
  return await adminService.getAllUsers();
};

// get all categories

export const getAllCategoriesByAdmin = async () => {
  return await adminService.getAllCategory();
};

// get all subjects

export const getAllSubjectsByAdmin = async () => {
  return await adminService.getAllSubjects();
};

// create category

export const createCategoryByAdmin = async (payload: {
  name: string;
  description: string;
}) => {
  const result = await adminService.createCategory(payload);

  if (result.data) {
    revalidateTag("categories", "max");
  }

  return result;
};

// update category

export const updateCategoryByAdmin = async (payload: {
  categoryId: string;
  name?: string;
  description?: string;
}) => {
  const result = await adminService.updateCategory(payload);
  if (result.data) {
    revalidateTag("categories", "max");
  }
  return result;
};

// delete category

export const deleteCategoryByAdmin = async (categoryId: string) => {
  const result = await adminService.deleteCategory(categoryId);
  if (result.data) {
    revalidateTag("categories", "max");
  }
  return result;
};
// add subject

export const addSubjectByAdmin = async (payload: {
  categoryId: string;
  name: string;
}) => {
  const result = await adminService.addSubject(payload);

  if (result.data) {
    revalidateTag("subjects", "max");
  }

  return result;
};

// update category

export const updateSubjectByAdmin = async (payload: {
  subjectId: string;
  name: string;
}) => {
  const result = await adminService.updateSubject(payload);
  if (result.data) {
    revalidateTag("subjects", "max");
  }
  return result;
};

// delete category

export const deleteSubjectByAdmin = async (subjectId: string) => {
  const result = await adminService.deleteSubject(subjectId);
  if (result.data) {
    revalidateTag("subjects", "max");
  }
  return result;
};

// manage users by banning and unbanning

export const manageUserByAdmin = async (payload: {
  userId: string;
  status: Status;
}) => {
  const result = await adminService.manageUser(payload);

  if (result.data) {
    revalidateTag("admin-users", "max");
  }
  return result;
};

// manage tutors by featuring true and false

export const manageTutorByAdmin = async (payload: {
  tutorId: string;
  isFeatured: boolean;
}) => {
  const result = await adminService.manageTutor(payload);
  if (result.data) {
    revalidateTag("admin-users", "max");
  }
  return result;
};

export const allBookings = async () => {
  return await adminService.getAllBookings();
};
