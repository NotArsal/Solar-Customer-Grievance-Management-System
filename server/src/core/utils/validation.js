import { z } from 'zod';

export const complaintSchema = z.object({
  body: z.object({
    customer_name: z.string().min(1, 'Customer name is required').max(100),
    customer_phone: z.string().min(1, 'Phone number is required').max(20),
    customer_email: z.string().email('Invalid email address'),
    invoice_no: z.string().max(50).optional().nullable(),
    product_type: z.enum(['Solar Panel', 'Inverter', 'Battery', 'Service', 'Other', 'General']),
    category: z.string().min(1, 'Category is required').max(100),
    subject: z.string().min(1, 'Subject is required').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
    attachments: z.array(z.string().url('Attachment must be a valid URL')).max(5).optional(),
    source: z.enum(['web', 'telegram', 'email']).optional().default('web')
  })
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').max(100),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
    assigned_department: z.string().min(1, 'Department is required').max(100),
    sla_hours: z.number().int().positive('SLA hours must be a positive integer')
  })
});

export const validateZod = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.errors
    });
  }
};
