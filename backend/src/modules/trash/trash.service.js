const documentRepository = require('../../repositories/document.repository');
const folderRepository = require('../../repositories/folder.repository');

exports.listTrash = async (query) => ({
  documents: await documentRepository.listTrash(query),
  folders: await folderRepository.listTrash(query),
});
