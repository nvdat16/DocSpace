import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createFolder, getDocuments, getFolders, uploadDocument } from '../services/documents.api';
import '../styles/documentDashboard.css';

const fallbackDocs = [
  { name: 'Hợp đồng dịch vụ Q1.pdf', type: 'pdf', folder: 'Hợp đồng', size: '1.2 MB', date: '01/05/2026' },
  { name: 'Báo cáo doanh thu tháng 4.xlsx', type: 'xlsx', folder: 'Báo cáo', size: '840 KB', date: '28/04/2026' },
  { name: 'Đề xuất dự án Alpha.docx', type: 'docx', folder: 'Nội bộ', size: '560 KB', date: '25/04/2026' },
  { name: 'Hình ảnh sự kiện.jpg', type: 'img', folder: '', size: '3.1 MB', date: '22/04/2026' },
  { name: 'Hợp đồng NDA 2026.pdf', type: 'pdf', folder: 'Hợp đồng', size: '220 KB', date: '20/04/2026' },
  { name: 'Kế hoạch marketing Q2.pptx', type: 'pptx', folder: 'Báo cáo', size: '2.4 MB', date: '18/04/2026' },
  { name: 'Danh sách nhân sự.xlsx', type: 'xlsx', folder: 'Nội bộ', size: '120 KB', date: '15/04/2026' },
  { name: 'Biên bản họp tháng 4.docx', type: 'docx', folder: 'Nội bộ', size: '95 KB', date: '10/04/2026' },
  { name: 'Chính sách bảo mật.pdf', type: 'pdf', folder: 'Nội bộ', size: '310 KB', date: '05/04/2026' },
  { name: 'Thiết kế logo mới.jpg', type: 'img', folder: '', size: '1.8 MB', date: '01/04/2026' },
  { name: 'Hợp đồng thuê văn phòng.pdf', type: 'pdf', folder: 'Hợp đồng', size: '480 KB', date: '28/03/2026' },
  { name: 'Tổng hợp chi phí Q1.xlsx', type: 'xlsx', folder: 'Báo cáo', size: '230 KB', date: '20/03/2026' },
];

const navItems = [
  { label: 'Tất cả tài liệu', icon: 'dashboard', badge: '48', active: true },
  { label: 'Gần đây', icon: 'recent' },
  { label: 'Đã gắn sao', icon: 'star' },
  { label: 'Chờ duyệt', icon: 'pending', badge: '3' },
];

const stats = [
  { label: 'Tổng tài liệu', value: '48', sub: '+6 tháng này', color: undefined },
  { label: 'Dung lượng', value: '2.4 GB', sub: 'còn 7.6 GB', color: undefined },
  { label: 'Chia sẻ', value: '14', sub: 'với 5 thành viên', color: undefined },
  { label: 'Chờ duyệt', value: '3', sub: 'cần xem xét', color: '#D97706' },
];

const apiToUiType = {
  pdf: { cls: 'pdf-bg', label: 'PDF' },
  doc: { cls: 'docx-bg', label: 'DOC' },
  docx: { cls: 'docx-bg', label: 'DOC' },
  xls: { cls: 'xlsx-bg', label: 'XLS' },
  xlsx: { cls: 'xlsx-bg', label: 'XLS' },
  ppt: { cls: 'pptx-bg', label: 'PPT' },
  pptx: { cls: 'pptx-bg', label: 'PPT' },
  jpg: { cls: 'img-bg', label: 'IMG' },
  jpeg: { cls: 'img-bg', label: 'IMG' },
  png: { cls: 'img-bg', label: 'IMG' },
  gif: { cls: 'img-bg', label: 'IMG' },
  img: { cls: 'img-bg', label: 'IMG' },
};

function getSizeLabel(bytes) {
  const value = Number(bytes || 0);
  if (value >= 1024 * 1024 * 1024) return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${value} B`;
}

function getDocMetaFromApi(doc) {
  const fileName = doc.fileName || doc.file_name || doc.title || 'Untitled';
  const ext = (fileName.split('.').pop() || '').toLowerCase();
  const mimeKey = (doc.mimeType || doc.mime_type || '').split('/').pop();
  const typeInfo = apiToUiType[ext] || apiToUiType[mimeKey] || { cls: 'img-bg', label: 'FILE' };
  const createdAt = doc.createdAt || doc.created_at;

  return {
    id: doc.id,
    name: fileName,
    type: ext || mimeKey || 'img',
    folder: doc.folderName || doc.folder_name || '',
    size: getSizeLabel(doc.size),
    date: createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '—',
    typeLabel: typeInfo.label,
    typeClass: typeInfo.cls,
  };
}

function Icon({ name }) {
  if (name === 'dashboard') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>;
  }
  if (name === 'recent') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M4 8h8M6 12h4" /></svg>;
  }
  if (name === 'star') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5z" /></svg>;
  }
  if (name === 'pending') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" /></svg>;
  }
  if (name === 'folder') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4a1 1 0 011-1h3.5l1.5 2H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" /></svg>;
  }
  if (name === 'account') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="6" r="2.5" /><path d="M3 14a5 5 0 0110 0" /></svg>;
  }
  if (name === 'settings') {
    return <svg className="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2" /></svg>;
  }
  return null;
}

function ActionIcon({ type }) {
  if (type === 'search') {
    return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5" /><path d="M12 12l2 2" /></svg>;
  }
  if (type === 'upload') {
    return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v9M5 5l3-3 3 3" /><path d="M2 13h12" /></svg>;
  }
  if (type === 'grid') {
    return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>;
  }
  if (type === 'list') {
    return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M3 8h10M3 12h10" /></svg>;
  }
  if (type === 'upload-zone') {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}><path d="M12 3v13M8 7l4-4 4 4" /><path d="M20 16v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3" /></svg>;
  }
  return null;
}

export default function DocumentDashboard() {
  const [docs, setDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [curTab, setCurTab] = useState('all');
  const [curView, setCurView] = useState('grid');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [toast, setToast] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    folderId: '',
    tags: '',
  });
  const [folderForm, setFolderForm] = useState({
    name: '',
    parentId: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoadingDocs(true);
    getDocuments()
      .then((response) => {
        const items = (response.data || []).map(getDocMetaFromApi);
        if (mounted) setDocs(items);
      })
      .catch(() => {
        if (mounted) setToast('Không tải được dữ liệu từ API, đang dùng dữ liệu mẫu');
      })
      .finally(() => {
        if (mounted) setLoadingDocs(false);
      });

    getFolders()
      .then((response) => {
        if (mounted) setFolders((response.data || []).filter((folder) => folder.status !== 'trash'));
      })
      .catch(() => {
        if (mounted) setFolders([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredDocs = useMemo(() => {
    const query = searchQ.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchTab = curTab === 'all' || doc.type === curTab;
      const matchQuery = !query || doc.name.toLowerCase().includes(query) || doc.folder.toLowerCase().includes(query);
      return matchTab && matchQuery;
    });
  }, [curTab, docs, searchQ]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__docToastTimer);
    window.__docToastTimer = window.setTimeout(() => setToast(''), 2000);
  };

  const toggleSelect = (idx) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setShowUploadZone(false);
  };

  const closeUploadModal = () => {
    if (uploading) return;
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadForm({ title: '', description: '', folderId: '', tags: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFolderModal = () => {
    setShowFolderModal(true);
  };

  const closeFolderModal = () => {
    if (creatingFolder) return;
    setShowFolderModal(false);
    setFolderForm({ name: '', parentId: '' });
  };

  const handleModalFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadForm((current) => ({
      ...current,
      title: current.title || file.name,
    }));
  };

  const handleUploadFieldChange = (field) => (event) => {
    setUploadForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleFolderFieldChange = (field) => (event) => {
    setFolderForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      showToast('Vui lòng chọn file trước khi tải lên');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadForm.title || selectedFile.name);
      formData.append('description', uploadForm.description || '');
      if (uploadForm.folderId) formData.append('folderId', uploadForm.folderId);
      if (uploadForm.tags) formData.append('tags', JSON.stringify(uploadForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean)));

      await uploadDocument(formData);
      const response = await getDocuments();
      setDocs((response.data || []).map(getDocMetaFromApi));
      showToast('Đã tải file lên thành công');
      closeUploadModal();
    } catch (error) {
      showToast(error.message || 'Tải file thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async (event) => {
    event.preventDefault();

    if (!folderForm.name.trim()) {
      showToast('Vui lòng nhập tên thư mục');
      return;
    }

    try {
      setCreatingFolder(true);
      await createFolder({
        name: folderForm.name.trim(),
        parentId: folderForm.parentId || null,
      });

      const response = await getFolders();
      setFolders(response.data || []);
      showToast('Đã tạo thư mục thành công');
      closeFolderModal();
    } catch (error) {
      showToast(error.message || 'Tạo thư mục thất bại');
    } finally {
      setCreatingFolder(false);
    }
  };

  const hasDocs = filteredDocs.length > 0;

  return (
    <div className="doc-shell">
      <aside className="doc-sidebar">
        <div className="doc-logo">Doc<span>Space</span></div>

        {navItems.map((item) => (
          <button key={item.label} type="button" className={`doc-nav-item${item.active ? ' active' : ''}`} onClick={() => showToast(`Đã chuyển sang ${item.label}`)}>
            <Icon name={item.icon} />
            {item.label}
            {item.badge ? <span className="doc-badge">{item.badge}</span> : null}
          </button>
        ))}

        <div className="doc-nav-section">Thư mục</div>

        {folders.map((item) => (
          <button key={item.id} type="button" className="doc-nav-item" onClick={() => showToast(`Đang mở thư mục ${item.name}`)}>
            <Icon name="folder" />
            {item.name}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <button type="button" className="doc-nav-item" onClick={() => showToast('Mở tài khoản')}>
            <Icon name="account" />
            Tài khoản
          </button>
          <button type="button" className="doc-nav-item" onClick={() => showToast('Mở cài đặt')}>
            <Icon name="settings" />
            Cài đặt
          </button>
        </div>
      </aside>

      <div className="doc-main">
        <div className="doc-topbar">
          <span className="doc-topbar-title">Tất cả tài liệu</span>

          <div className="doc-search-wrap">
            <ActionIcon type="search" />
            <input value={searchQ} onChange={(event) => setSearchQ(event.target.value)} placeholder="Tìm kiếm tài liệu..." />
          </div>

          <button type="button" className="doc-btn doc-btn-ghost" onClick={openUploadModal} disabled={uploading}>
            <ActionIcon type="upload" />
            {uploading ? 'Đang tải...' : 'Upload tài liệu'}
          </button>
          <input ref={fileInputRef} type="file" hidden onChange={handleModalFileChange} />

          <button type="button" className="doc-btn doc-btn-ghost doc-btn-inline" onClick={openFolderModal}>
            <span className="doc-btn-icon-wrap">
              <Icon name="folder" />
            </span>
            Tạo thư mục
          </button>
        </div>

        <div className="doc-stats-row">
          {stats.map((item) => (
            <div key={item.label} className="doc-stat">
              <div className="doc-stat-label">{item.label}</div>
              <div className="doc-stat-val" style={item.color ? { color: item.color } : undefined}>{item.value}</div>
              <div className="doc-stat-sub">{item.sub}</div>
            </div>
          ))}
        </div>

        <div className="doc-content">
          <div className={`doc-upload-zone${showUploadZone ? ' show' : ''}`} onClick={openUploadModal}>
            <ActionIcon type="upload-zone" />
            Kéo thả tệp vào đây hoặc nhấn để chọn tệp
          </div>

          <div className="doc-filter-row">
            <button type="button" className={`doc-tab${curTab === 'all' ? ' active' : ''}`} onClick={() => setCurTab('all')}>Tất cả</button>
            <button type="button" className={`doc-tab${curTab === 'pdf' ? ' active' : ''}`} onClick={() => setCurTab('pdf')}>PDF</button>
            <button type="button" className={`doc-tab${curTab === 'docx' ? ' active' : ''}`} onClick={() => setCurTab('docx')}>Word</button>
            <button type="button" className={`doc-tab${curTab === 'xlsx' ? ' active' : ''}`} onClick={() => setCurTab('xlsx')}>Excel</button>
            <button type="button" className={`doc-tab${curTab === 'img' ? ' active' : ''}`} onClick={() => setCurTab('img')}>Ảnh</button>

            <div className="doc-view-btns">
              <button type="button" className={`doc-vbtn${curView === 'grid' ? ' active' : ''}`} onClick={() => setCurView('grid')}><ActionIcon type="grid" /></button>
              <button type="button" className={`doc-vbtn${curView === 'list' ? ' active' : ''}`} onClick={() => setCurView('list')}><ActionIcon type="list" /></button>
            </div>
          </div>

          {loadingDocs ? (
            <div style={{ padding: '24px 8px', color: 'var(--color-text-tertiary, #94a3b8)' }}>Đang tải dữ liệu từ MySQL...</div>
          ) : null}

          {!loadingDocs && !hasDocs ? (
            <div style={{ padding: '24px 8px', color: 'var(--color-text-tertiary, #94a3b8)' }}>Chưa có tài liệu nào trong MySQL.</div>
          ) : null}

          <div className={`doc-grid${curView === 'grid' ? '' : ' is-hidden'}`}>
            {filteredDocs.map((doc, idx) => {
              const isSelected = selected.has(idx);
              return (
                <div key={`${doc.name}-${idx}`} className={`doc-card${isSelected ? ' selected' : ''}`} onClick={() => toggleSelect(idx)}>
                  <div className={`doc-icon ${doc.typeClass || 'img-bg'}`}>{doc.typeLabel || 'FILE'}</div>
                  <div className="doc-actions">
                    <button type="button" className="doc-icon-btn" onClick={(event) => { event.stopPropagation(); showToast('Đã gắn sao!'); }}>☆</button>
                    <button type="button" className="doc-icon-btn" onClick={(event) => { event.stopPropagation(); showToast('Đã tải xuống!'); }}>↓</button>
                  </div>
                  <div className="doc-name" title={doc.name}>{doc.name}</div>
                  <div className="doc-meta">{doc.size} · {doc.date}</div>
                  {doc.folder ? <div className="doc-meta" style={{ marginTop: 4 }}><span className="doc-folder-chip">{doc.folder}</span></div> : null}
                </div>
              );
            })}
          </div>

          <div className={`doc-list${curView === 'list' ? ' is-visible' : ''}`}>
            <div className="doc-list-header">
              <div className="doc-check" style={{ visibility: 'hidden' }} />
              <div style={{ width: 28, flexShrink: 0 }} />
              <div className="doc-list-hd-name">Tên tài liệu</div>
              <div className="doc-list-col-hd">Thư mục</div>
              <div className="doc-list-col-hd">Kích thước</div>
              <div className="doc-list-col-hd">Ngày</div>
            </div>

            {filteredDocs.map((doc, idx) => {
              const isSelected = selected.has(idx);
              return (
                <div key={`${doc.name}-${idx}-list`} className={`doc-list-row${isSelected ? ' selected' : ''}`} onClick={() => toggleSelect(idx)}>
                  <div className={`doc-check${isSelected ? ' checked' : ''}`}>{isSelected ? '✓' : ''}</div>
                  <div className={`doc-list-icon ${doc.typeClass || 'img-bg'}`}>{doc.typeLabel || 'FILE'}</div>
                  <div className="doc-list-name" title={doc.name}>{doc.name}</div>
                  <div className="doc-list-col">{doc.folder ? <span className="doc-folder-chip">{doc.folder}</span> : '-'}</div>
                  <div className="doc-list-col">{doc.size}</div>
                  <div className="doc-list-col">{doc.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showUploadModal ? (
        <div className="doc-modal-backdrop" onClick={closeUploadModal}>
          <div className="doc-modal" onClick={(event) => event.stopPropagation()}>
            <div className="doc-modal-header">
              <div>
                <div className="doc-modal-title">Upload tài liệu</div>
                <div className="doc-modal-subtitle">Nhập metadata trước khi tải file lên hệ thống</div>
              </div>
              <button type="button" className="doc-modal-close" onClick={closeUploadModal} disabled={uploading}>
                ×
              </button>
            </div>

            <form className="doc-modal-form" onSubmit={handleUploadSubmit}>
              <div className="doc-dropzone" onClick={handlePickFile}>
                <ActionIcon type="upload-zone" />
                <strong>{selectedFile ? selectedFile.name : 'Chọn file từ máy'}</strong>
                <span>{selectedFile ? `${getSizeLabel(selectedFile.size)} · ${selectedFile.type || 'unknown'}` : 'Nhấn để mở hộp thoại chọn file'}</span>
              </div>

              <div className="doc-form-grid">
                <label className="doc-field">
                  <span>Tiêu đề</span>
                  <input
                    value={uploadForm.title}
                    onChange={handleUploadFieldChange('title')}
                    placeholder="Tên tài liệu"
                    required
                  />
                </label>

                <label className="doc-field">
                  <span>Thư mục</span>
                  <select value={uploadForm.folderId} onChange={handleUploadFieldChange('folderId')}>
                    <option value="">Chọn thư mục</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="doc-field">
                <span>Mô tả</span>
                <textarea
                  rows="4"
                  value={uploadForm.description}
                  onChange={handleUploadFieldChange('description')}
                  placeholder="Mô tả ngắn cho tài liệu"
                />
              </label>

              <label className="doc-field">
                <span>Tags</span>
                <input
                  value={uploadForm.tags}
                  onChange={handleUploadFieldChange('tags')}
                  placeholder="ví dụ: hợp đồng, q1, nội bộ"
                />
              </label>

              <div className="doc-modal-actions">
                <button type="button" className="doc-btn doc-btn-ghost" onClick={closeUploadModal} disabled={uploading}>
                  Hủy
                </button>
                <button type="submit" className="doc-btn doc-btn-primary" disabled={uploading}>
                  {uploading ? 'Đang tải...' : 'Tải lên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showFolderModal ? (
        <div className="doc-modal-backdrop" onClick={closeFolderModal}>
          <div className="doc-modal doc-modal-sm" onClick={(event) => event.stopPropagation()}>
            <div className="doc-modal-header">
              <div>
                <div className="doc-modal-title">Tạo thư mục</div>
                <div className="doc-modal-subtitle">Tạo thư mục mới để sắp xếp tài liệu</div>
              </div>
              <button type="button" className="doc-modal-close" onClick={closeFolderModal} disabled={creatingFolder}>
                ×
              </button>
            </div>

            <form className="doc-modal-form" onSubmit={handleCreateFolder}>
              <label className="doc-field">
                <span>Tên thư mục</span>
                <input
                  value={folderForm.name}
                  onChange={handleFolderFieldChange('name')}
                  placeholder="VD: Hợp đồng, Báo cáo..."
                  required
                />
              </label>

              <label className="doc-field">
                <span>Thư mục cha</span>
                <select value={folderForm.parentId} onChange={handleFolderFieldChange('parentId')}>
                  <option value="">Không có</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="doc-modal-actions">
                <button type="button" className="doc-btn doc-btn-ghost" onClick={closeFolderModal} disabled={creatingFolder}>
                  Hủy
                </button>
                <button type="submit" className="doc-btn doc-btn-primary" disabled={creatingFolder}>
                  {creatingFolder ? 'Đang tạo...' : 'Tạo thư mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className={`doc-toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}
