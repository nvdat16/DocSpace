const folderRepository = require('../repositories/folder.repository');

exports.listFolders = (query) => folderRepository.listFolders(query);

exports.getFolderById = (id, ownerId) => folderRepository.findFolderById(id, ownerId);

exports.getFolderTree = (ownerId) => folderRepository.getFolderTree(ownerId);

exports.createFolder = async (payload, ownerId) => {
  if (!payload || !payload.name) {
    const error = new Error('Folder name is required');
    error.status = 400;
    throw error;
  }

  return folderRepository.createFolder({ ...payload, ownerId });
};

exports.updateFolder = (id, payload, ownerId) => folderRepository.updateFolder(id, payload, ownerId);

exports.softDeleteFolder = (id, ownerId) => folderRepository.softDeleteFolder(id, ownerId);

exports.restoreFolder = (id, ownerId) => folderRepository.restoreFolder(id, ownerId);

exports.permanentlyDeleteFolder = (id, ownerId) => folderRepository.permanentlyDeleteFolder(id, ownerId);

exports.listTrash = (ownerId) => folderRepository.listTrash(ownerId);
