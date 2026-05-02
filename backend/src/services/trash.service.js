const documentRepository = require('../repositories/document.repository');
const folderRepository = require('../repositories/folder.repository');

exports.listTrash = async () => ({
  documents: await documentRepository.listTrash(),
  folders: await folderRepository.listTrash(),
});