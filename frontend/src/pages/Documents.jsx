import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import FileCard from '../components/FileCard';
import DocumentUploadForm from '../components/DocumentUploadForm';
import FolderCreateForm from '../components/FolderCreateForm';
import { createDocument, createFolder, getDocuments } from '../services/documents.api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [message, setMessage] = useState('');

  const loadDocuments = async () => {
    const response = await getDocuments();
    setDocuments(response.data || []);
  };

  useEffect(() => {
    loadDocuments().catch((error) => {
      setMessage(error.message);
    });
  }, []);

  const handleUpload = async (payload) => {
    try {
      await createDocument(payload);
      setShowUploadForm(false);
      setMessage('Đã tạo tài liệu');
      await loadDocuments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCreateFolder = async (payload) => {
    try {
      await createFolder(payload);
      setShowFolderForm(false);
      setMessage('Đã tạo thư mục');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section>
          <h1 style={{ marginBottom: '0.5rem' }}>Documents</h1>
          <p style={{ color: '#64748b' }}>Quản lý danh sách tài liệu, upload và xem nhanh.</p>
          {message ? <p style={{ color: '#2563eb' }}>{message}</p> : null}
        </section>

        <section
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setShowUploadForm((value) => !value)}
            style={{
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: 10,
              cursor: 'pointer',
            }}
          >
            Upload tài liệu
          </button>
          <button
            onClick={() => setShowFolderForm((value) => !value)}
            style={{
              border: '1px solid #cbd5e1',
              background: '#fff',
              color: '#0f172a',
              padding: '0.75rem 1rem',
              borderRadius: 10,
              cursor: 'pointer',
            }}
          >
            Tạo thư mục
          </button>
        </section>

        {showUploadForm ? <DocumentUploadForm onSubmit={handleUpload} /> : null}
        {showFolderForm ? <FolderCreateForm onSubmit={handleCreateFolder} /> : null}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {documents.map((doc) => (
            <FileCard key={doc.id} title={doc.title} description={doc.description} />
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
