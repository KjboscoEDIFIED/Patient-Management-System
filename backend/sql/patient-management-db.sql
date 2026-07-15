-- Patient Management System - Database Schema
-- Run this once against your MySQL server to create the database and tables.

CREATE DATABASE IF NOT EXISTS patient_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE patient_management;

-- Users table (system users / staff who log in)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(150),
  address VARCHAR(255),
  blood_group VARCHAR(10),
  emergency_contact_name VARCHAR(150),
  emergency_contact_phone VARCHAR(30),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Patient medical records table (visit notes / history entries)
CREATE TABLE IF NOT EXISTS patient_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  visit_date DATE NOT NULL,
  diagnosis VARCHAR(255),
  treatment TEXT,
  notes TEXT,
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_patients_name ON patients (last_name, first_name);
CREATE INDEX idx_records_patient ON patient_records (patient_id);
