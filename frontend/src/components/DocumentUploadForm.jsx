import React, { useState } from 'react';

export default function DocumentUploadForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', fileName: '', folderId: '' });
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setForm((current) => ({
        ...current,
        fileName: selectedFile.name,
        title: current.title || selectedFile.name,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, file, folderId: form.folderId ? Number(form.folderId) : null });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <input name="title" placeholder="Tên tài liệu" value={form.title} onChange={handleChange} />
      <input name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
      <input type="file" onChange={handleFileChange} />
      <input name="folderId" placeholder="Folder ID" value={form.folderId} onChange={handleChange} />
      <button type="submit">Lưu tài liệu</button>
    </form>
  );
}
