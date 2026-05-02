-- DocSpace MySQL migration: initial schema sync
-- Run this file in MySQL Workbench / phpMyAdmin / mysql CLI.

CREATE DATABASE IF NOT EXISTS docspace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE docspace;

-- =========================
-- ROLES
-- =========================
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_code (code),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) NULL,
  status ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_status (status)
) ENGINE=InnoDB;

-- =========================
-- USER ROLES
-- =========================
CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- FOLDERS
-- =========================
CREATE TABLE IF NOT EXISTS folders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  owner_id BIGINT UNSIGNED NULL,
  path VARCHAR(1000) NULL,
  description TEXT NULL,
  status ENUM('active', 'trash') NOT NULL DEFAULT 'active',
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_folders_parent_id (parent_id),
  KEY idx_folders_owner_id (owner_id),
  KEY idx_folders_status (status),
  CONSTRAINT fk_folders_parent
    FOREIGN KEY (parent_id) REFERENCES folders (id)
    ON DELETE SET NULL,
  CONSTRAINT fk_folders_owner
    FOREIGN KEY (owner_id) REFERENCES users (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- DOCUMENTS
-- =========================
CREATE TABLE IF NOT EXISTS documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  file_name VARCHAR(255) NULL,
  original_name VARCHAR(255) NULL,
  file_path VARCHAR(1000) NULL,
  mime_type VARCHAR(100) NULL,
  size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  file_size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  file_ext VARCHAR(20) NULL,
  tags JSON NULL,
  owner_id BIGINT UNSIGNED NULL,
  folder_id BIGINT UNSIGNED NULL,
  is_public TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active', 'trash', 'archived') NOT NULL DEFAULT 'active',
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_documents_owner_id (owner_id),
  KEY idx_documents_folder_id (folder_id),
  KEY idx_documents_status (status),
  KEY idx_documents_created_at (created_at),
  FULLTEXT KEY ft_documents_search (title, description, file_name, original_name),
  CONSTRAINT fk_documents_owner
    FOREIGN KEY (owner_id) REFERENCES users (id)
    ON DELETE SET NULL,
  CONSTRAINT fk_documents_folder
    FOREIGN KEY (folder_id) REFERENCES folders (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- DOCUMENT VERSIONS
-- =========================
CREATE TABLE IF NOT EXISTS document_versions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  document_id BIGINT UNSIGNED NOT NULL,
  version_number INT NOT NULL,
  file_name VARCHAR(255) NULL,
  file_path VARCHAR(1000) NULL,
  mime_type VARCHAR(100) NULL,
  file_size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  change_note VARCHAR(500) NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_document_versions_doc_version (document_id, version_number),
  KEY idx_document_versions_document_id (document_id),
  KEY idx_document_versions_created_by (created_by),
  CONSTRAINT fk_document_versions_document
    FOREIGN KEY (document_id) REFERENCES documents (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_document_versions_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- SHARES
-- =========================
CREATE TABLE IF NOT EXISTS shares (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  document_id BIGINT UNSIGNED NOT NULL,
  shared_by BIGINT UNSIGNED NULL,
  share_type ENUM('internal', 'public') NOT NULL DEFAULT 'internal',
  share_token VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  expires_at DATETIME NULL,
  max_views INT NULL,
  view_count INT NOT NULL DEFAULT 0,
  allow_download TINYINT(1) NOT NULL DEFAULT 1,
  allow_preview TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('active', 'expired', 'revoked') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shares_token (share_token),
  KEY idx_shares_document_id (document_id),
  KEY idx_shares_shared_by (shared_by),
  KEY idx_shares_status (status),
  CONSTRAINT fk_shares_document
    FOREIGN KEY (document_id) REFERENCES documents (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_shares_shared_by
    FOREIGN KEY (shared_by) REFERENCES users (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- TRASH ITEMS
-- =========================
CREATE TABLE IF NOT EXISTS trash_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  item_type ENUM('document', 'folder') NOT NULL,
  item_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  deleted_by BIGINT UNSIGNED NULL,
  deleted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  restore_before DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_trash_items_type (item_type),
  KEY idx_trash_items_item_id (item_id),
  KEY idx_trash_items_deleted_by (deleted_by),
  KEY idx_trash_items_restore_before (restore_before),
  CONSTRAINT fk_trash_items_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES users (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- ROLE SEED
-- =========================
INSERT INTO roles (name, code, description)
VALUES
  ('Admin', 'admin', 'Toàn quyền'),
  ('Editor', 'editor', 'Chỉnh sửa và upload'),
  ('Viewer', 'viewer', 'Chỉ xem')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);
