const folderRepository = require('../repositories/folder.repository');

exports.listFolders = (query) => folderRepository.listFolders(query);

exports.getFolderById = (id) => folderRepository.findFolderById(id);

exports.getFolderTree = () => folderRepository.getFolderTree();

exports.createFolder = async (payload) => {
  if (!payload || !payload.name) {
    const error = new Error('Folder name is required');
    error.status = 400;
    throw error;
  }

  return folderRepository.createFolder(payload);
};

exports.updateFolder = (id, payload) => folderRepository.updateFolder(id, payload);

exports.softDeleteFolder = (id) => folderRepository.softDeleteFolder(id);

exports.restoreFolder = (id) => folderRepository.restoreFolder(id);

exports.permanentlyDeleteFolder = (id) => folderRepository.permanentlyDeleteFolder(id);

exports.listTrash = () => folderRepository.listTrash();
