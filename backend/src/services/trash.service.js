const documentRepository = require('../repositories/document.repository');
const folderRepository = require('../repositories/folder.repository');

exports.listTrash = async (ownerId) => ({
  documents: await documentRepository.listTrash(ownerId),
  folders: await folderRepository.listTrash(ownerId),
});