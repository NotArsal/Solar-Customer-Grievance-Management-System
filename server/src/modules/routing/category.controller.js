import { asyncHandler } from '../../core/utils/asyncHandler.js';
import Category from './category.model.js';

export const createCategory = asyncHandler(async (req, res) => {
  const { name, priority, assigned_department, sla_hours } = req.body;
  const category = await Category.create({ name, priority, assigned_department, sla_hours });
  res.status(201).json(category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ is_active: true }).sort({ name: 1 });
  res.json(categories);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndUpdate(id, { is_active: false });
  res.json({ message: 'Category deactivated' });
});
