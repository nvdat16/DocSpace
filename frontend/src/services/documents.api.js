import { apiDelete, apiGet, apiPost, apiPatch } from './api';

export function getDocuments() {
  return apiGet('/api/documents');
}

export function createDocument(payload) {
  return apiPost('/api/documents', payload);
}

export function uploadDocument(formData) {
  return apiPost('/api/documents/upload', formData);
}

export function updateDocument(id, payload) {
  return apiPatch(`/api/documents/${id}`, payload);
}

export function deleteDocument(id) {
  return apiDelete(`/api/documents/${id}`);
}

export function restoreDocument(id) {
  return apiPost(`/api/documents/${id}/restore`);
}

export function getFolders() {
  return apiGet('/api/folders');
}

export function createFolder(payload) {
  return apiPost('/api/folders', payload);
}
