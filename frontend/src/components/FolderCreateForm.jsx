import React, { useState } from 'react';

export default function FolderCreateForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, parentId: parentId ? Number(parentId) : null });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <input placeholder="Tên thư mục" value={name} onChange={(event) => setName(event.target.value)} />
      <input placeholder="Parent ID" value={parentId} onChange={(event) => setParentId(event.target.value)} />
      <button type="submit">Tạo thư mục</button>
    </form>
  );
}
