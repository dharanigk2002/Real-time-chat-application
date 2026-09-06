export async function validateSchema(schema, data) {
  const validation = await schema.safeParseAsync(data);
  if (!validation.success) {
    const [issue] = validation.error.issues;
    return res.status(400).json({ success: false, error: issue.message });
  }
  return validation.data;
}
