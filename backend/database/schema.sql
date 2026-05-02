CREATE DATABASE IF NOT EXISTS docspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE docspace;

CREATE TABLE IF NOT EXISTS folders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  owner_id BIGINT UNSIGNED NULL,
  status ENUM('active', 'trash') NOT NULL DEFAULT 'active',
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_folders_parent_id (parent_id),
  INDEX idx_folders_owner_id (owner_id),
  INDEX idx_folders_status (status),
  CONSTRAINT fk_folders_parent FOREIGN KEY (parent_id) REFERENCES folders (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  file_name VARCHAR(255) NULL,
  mime_type VARCHAR(100) NULL,
  size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  tags JSON NULL,
  owner_id BIGINT UNSIGNED NULL,
  folder_id BIGINT UNSIGNED NULL,
  status ENUM('active', 'trash') NOT NULL DEFAULT 'active',
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_documents_folder_id (folder_id),
  INDEX idx_documents_owner_id (owner_id),
  INDEX idx_documents_status (status),
  FULLTEXT INDEX ft_documents_search (title, description, file_name),
  CONSTRAINT fk_documents_folder FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE SET NULL
) ENGINE=InnoDB;
