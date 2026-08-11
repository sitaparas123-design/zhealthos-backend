-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2026 at 04:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zhealthos_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `affiliates`
--

CREATE TABLE `affiliates` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `partner` varchar(191) NOT NULL,
  `rep` varchar(191) NOT NULL,
  `commissionRate` varchar(191) NOT NULL DEFAULT '15%',
  `referralsCount` int(11) NOT NULL DEFAULT 0,
  `totalPayout` double NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` varchar(191) NOT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `clinicName` varchar(191) DEFAULT NULL,
  `text` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `clinicId`, `clinicName`, `text`, `createdAt`) VALUES
('3189abc2-73b8-40df-aff2-f41008699068', 'a6239bcf-45ec-4e20-8eff-e14e1810053e', 'reh-222', 'o', '2026-07-31 22:26:53.883');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `patientName` varchar(191) NOT NULL,
  `practitionerId` varchar(191) DEFAULT NULL,
  `practitionerName` varchar(191) NOT NULL,
  `branchId` varchar(191) DEFAULT NULL,
  `branchName` varchar(191) DEFAULT NULL,
  `serviceName` varchar(191) DEFAULT NULL,
  `date` varchar(191) NOT NULL,
  `startTime` varchar(191) NOT NULL,
  `endTime` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Scheduled',
  `location` varchar(191) DEFAULT 'Melbourne Clinic',
  `room` varchar(191) DEFAULT 'Room A',
  `notes` text DEFAULT NULL,
  `fee` double NOT NULL DEFAULT 0,
  `isPaid` tinyint(1) NOT NULL DEFAULT 0,
  `travelDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`travelDetails`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patientId`, `patientName`, `practitionerId`, `practitionerName`, `branchId`, `branchName`, `serviceName`, `date`, `startTime`, `endTime`, `status`, `location`, `room`, `notes`, `fee`, `isPaid`, `travelDetails`, `createdAt`, `updatedAt`, `displayId`) VALUES
('05af83ca-e186-4300-99ab-4c9f4b6681a9', NULL, 'Emma Watson', NULL, 'Dr. Sarah Jenkins', NULL, NULL, NULL, '2026-08-04', '11:00', '12:00', 'Confirmed', 'Melbourne Clinic', 'Room B', 'Post-op shoulder assessment', 150, 0, NULL, '2026-08-04 10:44:23.749', '2026-08-04 10:44:23.749', 'APT-000003'),
('07d2ac9f-a56b-4dc9-b1cb-3d968848d54d', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', 'John Doe', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-28', '06:00', '10:45 AM', 'Cancelled', 'Melbourne Clinic', 'Room A', 'vbn', 150, 0, NULL, '2026-08-05 10:53:32.871', '2026-08-05 10:53:45.955', 'APT-000010'),
('51f3c4e0-83ab-41c7-8478-6c95404ac6d3', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-26', '06:06', '10:45 AM', 'Cancelled', 'Melbourne Clinic', 'Room A', 'hjk', 150, 0, NULL, '2026-08-05 04:00:45.111', '2026-08-05 04:08:20.404', 'APT-000004'),
('58eedf43-0158-4fcd-8735-5c4fdc1cca4f', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe', 'c6aa7e02-e1a0-4392-a8c5-cfe4cd84c7e6', 'Dr. Alex Vance', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-28', '10:00 AM', '10:45 AM', 'Cancelled', 'Melbourne Clinic', 'Room A', 'rrrrrrrrrrrrrr', 150, 0, NULL, '2026-08-05 04:07:42.150', '2026-08-05 10:12:15.661', 'APT-000006'),
('7242a14d-51bd-406e-89f7-acd777af0394', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe', 'f5a35a83-ff13-4f86-89aa-8f3341e91668', 'dr.radheshayam verma', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-27', '05:04', '10:45 AM', 'Cancelled', 'Melbourne Clinic', 'Room A', 'wertyuiop[', 150, 0, NULL, '2026-08-05 04:03:17.195', '2026-08-05 04:06:32.337', 'APT-000005'),
('95500a11-7508-4ac1-a468-0c1ca8a5bac8', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe111111111', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-05', '10:00 AM', '10:45 AM', 'Upcoming', 'Melbourne Clinic', 'Room A', '7845', 150, 0, NULL, '2026-08-05 10:38:02.622', '2026-08-05 10:38:02.622', 'APT-000009'),
('a75339f5-8190-4cd2-9743-eb6c4d3bbea8', NULL, 'John Doe', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Central Clinic', 'Physiotherapy Initial Consultation', '2026-07-31', '10:00 AM', '10:45 AM', 'Scheduled', 'Melbourne Clinic', 'Room A', NULL, 180, 0, NULL, '2026-07-31 09:33:53.428', '2026-07-31 09:33:53.428', 'APT-000001'),
('ab4a42c9-1cdf-492e-96ad-4c7e4e3c777d', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe', 'f5a35a83-ff13-4f86-89aa-8f3341e91668', 'dr.radheshayam verma', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-26', '10:00 AM', '10:45 AM', 'Upcoming', 'Melbourne Clinic', 'Room A', '12654', 150, 0, NULL, '2026-08-05 07:10:52.278', '2026-08-05 07:12:17.526', 'APT-000007'),
('aff72757-9411-4b9d-af11-43c381cac297', NULL, 'John Doe', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Central Clinic', 'Physiotherapy Initial Consultation', '2026-07-31', '10:00 AM', '10:45 AM', 'Scheduled', 'Melbourne Clinic', 'Room A', NULL, 180, 0, NULL, '2026-07-31 06:39:21.597', '2026-07-31 06:39:21.597', NULL),
('dc3d6e29-38d2-4f44-bf7c-5d15db8eb9b5', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-05', '10:00 AM', '10:45 AM', 'Upcoming', 'Melbourne Clinic', 'Room A', '', 150, 0, NULL, '2026-08-05 07:12:54.849', '2026-08-05 07:12:54.849', 'APT-000008'),
('de6eda99-9080-4d5e-a45a-bfc240c77e47', '663001d8-6632-4470-a897-5d60467cb613', 'Dr. Colin Edegbe111111111', NULL, 'Dr. Sarah Jenkins', NULL, 'Melbourne Allied Health', 'General Consultation', '2026-08-28', '10:00 AM', '10:45 AM', 'Upcoming', 'Melbourne Clinic', 'Room A', 'fgh', 150, 0, NULL, '2026-08-05 10:54:18.031', '2026-08-05 10:54:18.031', 'APT-000011');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `userName` varchar(191) DEFAULT NULL,
  `userRole` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `module` varchar(191) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actor` varchar(191) NOT NULL DEFAULT 'System',
  `category` varchar(191) NOT NULL DEFAULT 'General',
  `displayId` varchar(191) DEFAULT NULL,
  `ip` varchar(191) DEFAULT '10.42.18.1',
  `role` varchar(191) DEFAULT 'Admin',
  `severity` varchar(191) NOT NULL DEFAULT 'Info',
  `target` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `userId`, `userName`, `userRole`, `action`, `module`, `details`, `ipAddress`, `timestamp`, `actor`, `category`, `displayId`, `ip`, `role`, `severity`, `target`) VALUES
('0098615a-aa4b-45c9-93a2-247df085fe11', NULL, NULL, NULL, 'Clinic rohit eye hospital status set to Active', NULL, NULL, NULL, '2026-07-31 21:49:59.214', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000015', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('074fd540-a83e-4a14-aa87-cd26df7d3681', NULL, NULL, NULL, 'New device sign-in from Chicago, USA', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'David Okonkwo', 'Login Activity', 'AUD-000005', '198.51.100.18', 'Clinician', 'Warning', 'david.okonkwo@westend.health (Westend Wellness)'),
('0a036db8-f905-4aeb-8bdf-5232d93c2dcf', NULL, NULL, NULL, 'Invoice INV-000007 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 11:11:22.875', 'Super Admin', 'Billing', 'AUD-000048', '10.42.18.1', 'Super Admin', 'Info', 'reh-222'),
('0b49c104-fb8a-4e2d-a71b-f100c9404f88', NULL, NULL, NULL, 'Revoked admin role from former employee', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Michael Ross', 'Permissions', 'AUD-000009', '10.42.18.1', 'Super Admin', 'Warning', 'k.lee@cedarhill.health (Cedar Hill Clinic)'),
('0de46791-eea1-4386-8e4c-661284e6586f', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000006', NULL, NULL, NULL, '2026-08-01 09:55:16.268', 'Super Admin', 'Billing', 'AUD-000041', '10.42.18.1', 'Super Admin', 'Info', 'rohit eye hospital'),
('121278fa-3676-48be-bb4a-91136ce15e84', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000004', NULL, NULL, NULL, '2026-08-01 09:25:25.411', 'Super Admin', 'Billing', 'AUD-000031', '10.42.18.1', 'Super Admin', 'Info', 'Wynwood Wellness'),
('147c47a1-157a-4cb4-bb11-1823c3f6bc8c', NULL, NULL, NULL, 'Clinic reh-222 status set to Active', NULL, NULL, NULL, '2026-08-03 12:05:01.201', 'AlluarjunSuperadmin', 'Clinic Status', 'AUD-000056', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('1662c963-4fe0-4dba-b6a9-4ec3c239d0de', NULL, NULL, NULL, 'Password reset performed for REH-1', NULL, NULL, NULL, '2026-08-05 19:09:14.080', 'Dr. Colin Edegbe111111111', 'Security', 'AUD-000064', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'REH-1 (rohit@gmail.com)'),
('1813a717-94e2-4666-bdf5-922aa2ac1a76', NULL, NULL, NULL, 'SESSION_REVOKED', NULL, 'Revoked session 52288ca0-f30b-42a5-94db-0022a60b96f9', NULL, '2026-08-03 22:02:35.016', 'AlluarjunSuperadmin', 'Auth', NULL, '10.42.18.1', 'SUPER_ADMIN', 'Info', NULL),
('1b243fc7-1059-443f-9936-957fc83d5cfc', NULL, NULL, NULL, 'Subscription cancelled — effective end of cycle', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Priya Patel', 'Subscription', 'AUD-000006', '10.42.18.55', 'Owner', 'Warning', 'Hillcrest Vision'),
('1b4d0785-6729-44d2-800e-662bb8702ce3', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000008', NULL, NULL, NULL, '2026-08-01 09:55:56.337', 'Super Admin', 'Billing', 'AUD-000042', '10.42.18.1', 'Super Admin', 'Info', 'reh-3'),
('1c02fe7f-662f-4a50-a717-dc9f80f355c6', NULL, NULL, NULL, 'Upgraded subscription tier to Enterprise ($1000/mo)', NULL, NULL, NULL, '2026-08-05 20:04:56.287', 'Dr. Colin Edegbe111111111', 'Subscription', 'AUD-000067', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'REh-2 (9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4)'),
('1e475430-eb2a-4366-a5da-9035aae4928b', NULL, NULL, NULL, 'Clinic rohit eye hospital status set to Suspended', NULL, NULL, NULL, '2026-07-31 22:19:41.868', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000022', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('21360364-3bac-4251-bc85-1164f14aa4b7', NULL, NULL, NULL, 'Upgraded subscription tier to Basic ($100/mo)', NULL, NULL, NULL, '2026-08-05 20:28:10.932', 'Dr. Colin Edegbe111111111', 'Subscription', 'AUD-000070', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'REh-2 (9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4)'),
('222eebef-7023-4c4a-b157-1a0424dc987d', NULL, NULL, NULL, 'Invoice INV-000001 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 09:34:56.908', 'Super Admin', 'Billing', 'AUD-000035', '10.42.18.1', 'Super Admin', 'Info', 'Lakeside Medical'),
('24201061-8649-4172-8cf8-ab1042a66789', NULL, NULL, NULL, 'Clinic reh-222 status set to Suspended', NULL, NULL, NULL, '2026-08-01 10:03:19.068', 'kp manager1', 'Clinic Status', 'AUD-000044', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('25289466-ab34-4b8e-9d57-7d49fd1d5025', NULL, NULL, NULL, 'Add-on enabled: Advanced Analytics', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Sarah Chen', 'Subscription', 'AUD-000010', '10.42.18.7', 'Admin', 'Info', 'Riverstone Cardiology'),
('284e3c76-e2a2-49cc-b315-890655c731bc', NULL, NULL, NULL, 'Password reset performed for reh-222', NULL, NULL, NULL, '2026-08-03 12:13:07.226', 'AlluarjunSuperadmin', 'Security', 'AUD-000057', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'reh-222 (reh2@gmail.com)'),
('307507da-efa5-48f7-8b41-5086912f2556', NULL, NULL, NULL, 'Launched impersonation session for REh-2', NULL, NULL, NULL, '2026-08-05 20:21:38.339', 'Dr. Colin Edegbe111111111', 'Permissions', 'AUD-000068', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'REh-2 (9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4)'),
('36ee4797-7ca7-4086-a5a8-9ff0b1078024', NULL, NULL, NULL, 'Upgraded subscription tier to Pro ($250/mo)', NULL, NULL, NULL, '2026-08-05 20:24:00.427', 'Dr. Colin Edegbe111111111', 'Subscription', 'AUD-000069', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'REH-1 (d8cce2ae-745e-4d2a-ab39-834043e42ccd)'),
('3d7b8bb3-637e-429e-aada-5cff957bd427', NULL, NULL, NULL, 'Clinic rohit eye hospital sapna sageeta  access suspended & soft-deactivated by Super Admin', NULL, NULL, NULL, '2026-08-05 19:06:19.118', 'Dr. Colin Edegbe111111111', 'Permissions', 'AUD-779116', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital sapna sageeta '),
('40f4cfaf-1e27-4448-a7da-d341afa48f7f', NULL, NULL, NULL, 'Clinic rohit eye hospital status set to Active', NULL, NULL, NULL, '2026-07-31 22:19:48.730', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000023', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('4321e35b-8f51-495b-b3fb-f7dabcd99cee', NULL, NULL, NULL, 'Clinic Nishant Solanki1111111111111111111111111111111111111111 access suspended & soft-deactivated by Super Admin', NULL, NULL, NULL, '2026-08-05 11:47:01.506', 'Dr. Colin Edegbe111111111', 'Permissions', 'AUD-421505', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'Nishant Solanki1111111111111111111111111111111111111111'),
('43b13317-74d5-4571-b282-3898e8372f6b', NULL, NULL, NULL, 'Upgraded subscription tier to Pro ($250/mo)', NULL, NULL, NULL, '2026-07-31 21:42:40.700', 'Alex Sadman (Super Admin)', 'Subscription', 'AUD-000012', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('47f8d406-d337-4136-80f8-8a94db900aef', NULL, NULL, NULL, 'Granted billing access to user', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Michael Ross', 'Permissions', 'AUD-000003', '10.42.18.1', 'Super Admin', 'Critical', 'jane.doe@bayview.health (Bayview Family Clinic)'),
('48c5cc48-3342-4091-a093-0b83dbe954b9', NULL, NULL, NULL, 'Edited clinical note for patient #P-4821', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Dr. Amelia Park', 'Clinical Notes', 'AUD-000002', '10.42.18.22', 'Clinician', 'Warning', 'Patient P-4821 (Northside Dental)'),
('4a3c058d-4eab-442d-b3d5-6c3eb1a1399c', NULL, NULL, NULL, 'Failed login attempt — 5 consecutive failures', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Unknown', 'Login Activity', 'AUD-000004', '203.0.113.42', 'Unknown', 'Critical', 'admin@sunrisepeds.com (Sunrise Pediatrics)'),
('52288ca0-f30b-42a5-94db-0022a60b96f9', NULL, NULL, NULL, 'LOGIN', NULL, 'Session revoked by admin', NULL, '2026-08-03 05:31:32.243', 'Super Admin', 'Auth', 'LOG-000002', '120.91.4.11', 'SUPER_ADMIN', 'Revoked', 'iPhone App Client'),
('539bdc92-57f4-45b9-8b7a-0117c7aa4360', NULL, NULL, NULL, 'Updated System Security Controls & Policies', NULL, NULL, NULL, '2026-08-06 03:11:01.532', 'Alex Sadman (Super Admin)', 'Permissions', 'AUD-000072', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'Platform Wide'),
('5f28e63a-8b11-4c93-a790-69e00d5f7598', NULL, NULL, NULL, 'Billing cycle reset for reh-222', NULL, NULL, NULL, '2026-07-31 22:26:17.052', 'Alex Sadman (Super Admin)', 'Billing', 'AUD-000026', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('605b201f-2229-4f94-bc14-b360f9ac6409', NULL, NULL, NULL, 'Billing cycle reset for rohit eye hospital', NULL, NULL, NULL, '2026-07-31 21:51:06.418', 'Alex Sadman (Super Admin)', 'Billing', 'AUD-000018', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('647b58d0-e219-41d8-8b21-f79049485a16', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000004', NULL, NULL, NULL, '2026-08-01 09:32:44.700', 'Super Admin', 'Billing', 'AUD-000034', '10.42.18.1', 'Super Admin', 'Info', 'Wynwood Wellness'),
('6dc5f153-9528-4bc3-a658-cdf9ecae7736', NULL, NULL, NULL, 'Password reset performed for rohit eye hospital', NULL, NULL, NULL, '2026-08-03 06:03:57.671', 'kp manager1', 'Security', 'AUD-000054', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'rohit eye hospital (nishants@gmail.com)'),
('73ebf6df-20a1-449d-926f-dc3bd8c71238', NULL, NULL, NULL, 'Invoice INV-000006 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 09:56:01.546', 'Super Admin', 'Billing', 'AUD-000043', '10.42.18.1', 'Super Admin', 'Info', 'rohit eye hospital'),
('7917118a-4ada-4279-b091-c347b440c0df', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000014', NULL, NULL, NULL, '2026-08-06 03:15:05.401', 'Super Admin', 'Billing', 'AUD-000074', '10.42.18.1', 'Super Admin', 'Info', 'REh-2'),
('7d8d3a74-423e-4803-96a7-9443afb50b7b', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000004', NULL, NULL, NULL, '2026-08-01 09:24:35.967', 'Super Admin', 'Billing', 'AUD-000030', '10.42.18.1', 'Super Admin', 'Info', 'Wynwood Wellness'),
('7e3cc770-3ce1-4ad4-b90a-d5d59381c52f', NULL, NULL, NULL, 'Clinic dfghj access suspended & soft-deactivated by Super Admin', NULL, NULL, NULL, '2026-08-02 22:00:40.636', 'kp manager1', 'Permissions', 'AUD-040633', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'dfghj'),
('7e92535f-9021-4c07-a417-16a6998eb769', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000001', NULL, NULL, NULL, '2026-08-01 09:31:48.760', 'Super Admin', 'Billing', 'AUD-000033', '10.42.18.1', 'Super Admin', 'Info', 'Lakeside Medical'),
('81878c54-e335-4448-8774-75a566331290', NULL, NULL, NULL, 'Broadcast announcement sent to reh-222', NULL, NULL, NULL, '2026-07-31 22:26:53.892', 'Alex Sadman (Super Admin)', 'Announcement', 'AUD-000029', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'reh-222'),
('867d2e29-b2ac-4440-b771-e4e9b6d1b923', NULL, NULL, NULL, 'Clinic rohit eye hospital status set to Suspended', NULL, NULL, NULL, '2026-07-31 21:49:40.210', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000014', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('92cff9b8-99b1-44a9-8f49-33073ed24822', NULL, NULL, NULL, 'Clinic rohit eye hospital status set to Suspended', NULL, NULL, NULL, '2026-07-31 21:42:32.837', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000011', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('9895f052-b963-4996-8a59-14a18ab95eac', NULL, NULL, NULL, 'Invoice INV-000004 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 09:27:23.071', 'Super Admin', 'Billing', 'AUD-000032', '10.42.18.1', 'Super Admin', 'Info', 'Wynwood Wellness'),
('98efc23b-919f-4983-a9d5-c4478ba0bb62', NULL, NULL, NULL, 'Upgraded subscription tier to Basic ($100/mo)', NULL, NULL, NULL, '2026-07-31 21:50:15.451', 'Alex Sadman (Super Admin)', 'Subscription', 'AUD-000016', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('9a598248-db9b-49df-8760-0fb7111170bf', NULL, NULL, NULL, 'Upgraded subscription tier to Pro ($250/mo)', NULL, NULL, NULL, '2026-07-31 22:26:11.114', 'Alex Sadman (Super Admin)', 'Subscription', 'AUD-000025', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('a0f1f713-9cdc-4ba3-a295-2ce8a2d67aff', NULL, NULL, NULL, 'Clinic Nishant Solanki1111111111111111111111111111111111111111 access suspended & soft-deactivated by Super Admin', NULL, NULL, NULL, '2026-08-05 11:46:59.521', 'Dr. Colin Edegbe111111111', 'Permissions', 'AUD-419519', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'Nishant Solanki1111111111111111111111111111111111111111'),
('a59284d5-7b3a-4bca-a0fc-8147d2712d65', NULL, NULL, NULL, 'Password reset performed for rohit eye hospital sapna sageeta ', NULL, NULL, NULL, '2026-08-05 18:37:17.335', 'Dr. Colin Edegbe111111111', 'Security', 'AUD-000062', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'rohit eye hospital sapna sageeta  (roh@gmail.com)'),
('a5f3f7cb-e2ac-4952-8847-12385c73aa4b', NULL, NULL, NULL, 'Clinic reh-222 status set to Suspended', NULL, NULL, NULL, '2026-07-31 22:25:53.253', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000024', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('aeebc85e-060e-46b5-ad6c-327fcb6026ac', NULL, NULL, NULL, 'Launched impersonation session for reh-222', NULL, NULL, NULL, '2026-07-31 22:26:35.371', 'Alex Sadman (Super Admin)', 'Permissions', 'AUD-000027', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('b087762d-8f74-40ee-9e3f-7398b3d13438', NULL, NULL, NULL, 'Launched impersonation session for rohit eye hospital', NULL, NULL, NULL, '2026-08-03 06:21:26.741', 'kp manager1', 'Permissions', 'AUD-000055', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('b33e0df2-e093-4e1c-8e53-3d2240ef5a07', NULL, NULL, NULL, 'LOGIN', NULL, 'Melbourne, VIC', NULL, '2026-08-03 05:31:32.243', 'Super Admin', 'Auth', 'LOG-000003', '110.12.82.9', 'SUPER_ADMIN', 'Expired', 'Safari / macOS Sierra'),
('b4a7e991-21d3-4ab8-8df1-e00cbc0b539e', NULL, NULL, NULL, 'Launched impersonation session for rohit eye hospital', NULL, NULL, NULL, '2026-07-31 21:51:28.402', 'Alex Sadman (Super Admin)', 'Permissions', 'AUD-000019', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('b6aa015a-f87a-4f99-aa0c-20dab2419bd8', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000014', NULL, NULL, NULL, '2026-08-06 03:09:02.902', 'Super Admin', 'Billing', 'AUD-000071', '10.42.18.1', 'Super Admin', 'Info', 'REh-2'),
('b6b461b0-0394-46a8-9aa6-94d53f82f336', NULL, NULL, NULL, 'Deleted draft note (pre-finalization)', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Dr. Emily Rodriguez', 'Clinical Notes', 'AUD-000008', '10.42.18.33', 'Clinician', 'Info', 'Patient P-5102 (Maplewood Dermatology)'),
('c1cb14ae-56f6-497d-954c-faf5cf16df62', NULL, NULL, NULL, 'Invoice INV-000004 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 09:37:13.492', 'Super Admin', 'Billing', 'AUD-000036', '10.42.18.1', 'Super Admin', 'Info', 'Wynwood Wellness'),
('c25a683b-16ad-423f-adf2-106232b2a439', NULL, NULL, NULL, 'Payment method updated (Visa ending 4521)', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'James Wilson', 'Billing', 'AUD-000007', '10.42.18.61', 'Admin', 'Info', 'Greenfield Health'),
('c30f7bae-db4b-43c6-b0a9-7a0bef0ecfcd', NULL, NULL, NULL, 'Updated System Security Controls & Policies', NULL, NULL, NULL, '2026-08-06 03:12:12.221', 'Alex Sadman (Super Admin)', 'Permissions', 'AUD-000073', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'Platform Wide'),
('c46bcc79-d435-4d63-89f2-8adbd66142be', NULL, NULL, NULL, 'Clinic reh-222 status set to Active', NULL, NULL, NULL, '2026-08-01 10:08:24.772', 'kp manager1', 'Clinic Status', 'AUD-000045', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('c93942dc-9c8b-42dd-a194-7b526349b2af', NULL, NULL, NULL, 'Billing cycle reset for rohit eye hospital', NULL, NULL, NULL, '2026-07-31 21:56:35.082', 'Alex Sadman (Super Admin)', 'Billing', 'AUD-000021', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('cb8e8309-0768-4543-9cd8-4db4bb5dc1f0', NULL, NULL, NULL, 'LOGIN', NULL, 'Brisbane, QLD', NULL, '2026-08-03 05:31:32.243', 'Super Admin', 'Auth', 'LOG-000004', '198.51.100.4', 'SUPER_ADMIN', 'Revoked', 'Firefox / Linux Desktop'),
('cc450417-cb89-45b8-a656-da88cf51cf0d', NULL, NULL, NULL, 'Clinic rohit eye hospital status set to Active', NULL, NULL, NULL, '2026-07-31 21:42:51.071', 'Alex Sadman (Super Admin)', 'Clinic Status', 'AUD-000013', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('d06e4073-42ae-4157-b4a7-21fdfe947ded', NULL, NULL, NULL, 'Subscription plan upgraded from Basic to Professional', NULL, NULL, NULL, '2026-07-31 11:36:25.514', 'Sarah Chen', 'Billing', 'AUD-000001', '10.42.18.7', 'Admin', 'Info', 'Bayview Family Clinic'),
('d6104996-1527-48dc-8468-3f2c22d5c383', NULL, NULL, NULL, 'Upgraded subscription tier to Pro ($250/mo)', NULL, NULL, NULL, '2026-08-05 19:53:37.338', 'Dr. Colin Edegbe111111111', 'Subscription', 'AUD-000066', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'REh-2 (9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4)'),
('d686f95c-e4a0-4c0b-91c4-3f4292d21ab7', NULL, NULL, NULL, 'Password reset performed for REh-2', NULL, NULL, NULL, '2026-08-05 19:52:56.247', 'Dr. Colin Edegbe111111111', 'Security', 'AUD-000065', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'REh-2 (rohit2@gmail.com)'),
('d7493286-583e-49d4-a27f-b71bbd80fde7', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000008', NULL, NULL, NULL, '2026-08-01 09:55:07.987', 'Super Admin', 'Billing', 'AUD-000040', '10.42.18.1', 'Super Admin', 'Info', 'reh-3'),
('d8549f46-bc7e-4f60-8121-d129ca85aa3c', NULL, NULL, NULL, 'Invoice INV-000001 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 09:38:04.692', 'Super Admin', 'Billing', 'AUD-000039', '10.42.18.1', 'Super Admin', 'Info', 'Lakeside Medical'),
('de23892b-65c9-43d0-bc3e-2be006262cc4', NULL, NULL, NULL, 'Upgraded subscription tier to Enterprise ($1000/mo)', NULL, NULL, NULL, '2026-07-31 21:51:01.217', 'Alex Sadman (Super Admin)', 'Subscription', 'AUD-000017', '10.42.18.1', 'SUPER_ADMIN', 'Info', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)'),
('eeb9c7a0-ea6d-47ae-8bc5-6d60440d0315', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000001', NULL, NULL, NULL, '2026-08-01 09:37:41.103', 'Super Admin', 'Billing', 'AUD-000037', '10.42.18.1', 'Super Admin', 'Info', 'Lakeside Medical'),
('f12ae2c2-286b-4835-a108-86c5114ae919', NULL, NULL, NULL, 'Clinic Nishant Solanki1111111111111111111111111111111111111111 access suspended & soft-deactivated by Super Admin', NULL, NULL, NULL, '2026-08-05 11:47:15.373', 'Dr. Colin Edegbe111111111', 'Permissions', 'AUD-435371', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'Nishant Solanki1111111111111111111111111111111111111111'),
('f602308e-56a2-4d63-93f3-76a9e127e981', NULL, NULL, NULL, 'Clinic reh-222 access suspended & soft-deactivated by Super Admin', NULL, NULL, NULL, '2026-08-01 10:08:48.514', 'kp manager1', 'Permissions', 'AUD-928512', '10.42.18.1', 'SUPER_ADMIN', 'Warning', 'reh-222'),
('f78f3827-26ff-497d-ad0f-e541959cd4f4', NULL, NULL, NULL, 'Payment reminder email sent for invoice INV-000001', NULL, NULL, NULL, '2026-08-01 09:37:50.999', 'Super Admin', 'Billing', 'AUD-000038', '10.42.18.1', 'Super Admin', 'Info', 'Lakeside Medical'),
('f797d8fe-f17e-4375-b337-00c4f8f4e0d4', NULL, NULL, NULL, 'LOGIN', NULL, 'Melbourne, VIC', NULL, '2026-08-03 05:31:32.243', 'Super Admin', 'Auth', 'LOG-000001', '103.88.24.12', 'SUPER_ADMIN', 'Active Session', 'Chrome / Windows (Current)'),
('f846a79f-585e-4eb3-afa7-c26bf54a2031', NULL, NULL, NULL, 'Invoice INV-000008 manually marked as Paid', NULL, NULL, NULL, '2026-08-01 11:09:58.869', 'Super Admin', 'Billing', 'AUD-000047', '10.42.18.1', 'Super Admin', 'Info', 'reh-3'),
('fadd3f52-36cb-4de3-a9db-761b813753fd', NULL, NULL, NULL, 'Launched impersonation session for reh-222', NULL, NULL, NULL, '2026-07-31 22:26:40.743', 'Alex Sadman (Super Admin)', 'Permissions', 'AUD-000028', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'reh-222 (a6239bcf-45ec-4e20-8eff-e14e1810053e)'),
('feb74b2b-f3bf-4068-8258-0902294b18c8', NULL, NULL, NULL, 'Launched impersonation session for rohit eye hospital', NULL, NULL, NULL, '2026-07-31 21:56:33.836', 'Alex Sadman (Super Admin)', 'Permissions', 'AUD-000020', '10.42.18.1', 'SUPER_ADMIN', 'Critical', 'rohit eye hospital (249e7f58-98f6-4aa5-9920-7db3dadc0e57)');

-- --------------------------------------------------------

--
-- Table structure for table `body_chart_templates`
--

CREATE TABLE `body_chart_templates` (
  `id` varchar(191) NOT NULL,
  `practitionerId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `thumbnailUrl` varchar(191) DEFAULT NULL,
  `canvasData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`canvasData`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `body_chart_templates`
--

INSERT INTO `body_chart_templates` (`id`, `practitionerId`, `name`, `description`, `thumbnailUrl`, `canvasData`, `createdAt`, `updatedAt`) VALUES
('22c357ad-2b0c-4ef8-ab48-2ffd269cac77', '35a9f370-6909-4038-aa94-5bc6afba77ab', 'Upper Limb Assessment', 'Detailed upper limb chart including shoulder, elbow, wrist', NULL, NULL, '2026-08-04 21:01:39.681', '2026-08-04 21:01:39.681'),
('2e943253-c848-4b7b-9c84-e73efb6fed69', '47cceb18-21f6-4fe1-a6a9-686059c562b1', 'Lower Limb Assessment', 'Detailed lower limb chart including hip, knee, ankle', NULL, NULL, '2026-08-04 20:20:10.367', '2026-08-04 20:20:10.367'),
('8baf06eb-b095-45ca-ab3d-b8bf33bfead5', '35a9f370-6909-4038-aa94-5bc6afba77ab', 'Physiotherapy Full Body', 'Full body anterior & posterior chart for physiotherapy assessments', NULL, NULL, '2026-08-04 21:01:39.681', '2026-08-04 21:01:39.681'),
('b36dd45c-a695-47c5-aa83-e7b4b2f55963', '35a9f370-6909-4038-aa94-5bc6afba77ab', 'Lower Limb Assessment', 'Detailed lower limb chart including hip, knee, ankle', NULL, NULL, '2026-08-04 21:01:39.681', '2026-08-04 21:01:39.681'),
('c8c4a3a5-695f-47d0-97de-d2e9a57eca99', '47cceb18-21f6-4fe1-a6a9-686059c562b1', 'Physiotherapy Full Body', 'Full body anterior & posterior chart for physiotherapy assessments', NULL, NULL, '2026-08-04 20:20:10.367', '2026-08-04 20:20:10.367'),
('f9acf56f-525b-4944-85e7-006c79b3bb00', '47cceb18-21f6-4fe1-a6a9-686059c562b1', 'Upper Limb Assessment', 'Detailed upper limb chart including shoulder, elbow, wrist', NULL, NULL, '2026-08-04 20:20:10.367', '2026-08-04 20:20:10.367');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` varchar(191) NOT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `joinDate` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `timezone` varchar(191) NOT NULL DEFAULT 'AEDT',
  `businessHours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`businessHours`)),
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `clinicId`, `name`, `joinDate`, `email`, `phone`, `address`, `timezone`, `businessHours`, `status`, `createdAt`, `updatedAt`) VALUES
('252451bd-903d-4b35-91c9-5511c45716e0', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'Brisbane Health Hub', '10 Jun 2024', 'brisbane@ceotherapy.com.au', '+61 7 3333 4444', '12 Queen St, Brisbane QLD 4000', 'AEST (Sydney/Brisbane/Melbourne Standard)', '{\"startTime\":\"09:00 AM\",\"endTime\":\"05:00 PM\"}', 'Active', '2026-08-06 08:39:36.427', '2026-08-06 08:39:36.427'),
('2ce56c0e-611a-4877-94b9-53bc22435b03', NULL, 'Melbourne Central Clinic', NULL, 'melbourne@zhealth.com', '+61 3 9000 1111', '123 Care Street, Melbourne VIC', 'AEDT', NULL, 'Active', '2026-07-31 09:33:53.421', '2026-07-31 09:33:53.421'),
('3135be07-5f4b-44cd-91b6-cc4378af54ac', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'Main Clinic - Sydney CBD', '15 Jan 2024', 'sydney@ceotherapy.com.au', '+61 2 9123 4567', '45 Care Street, Sydney NSW 2000', 'AEST (Sydney/Brisbane/Melbourne Standard)', '{\"startTime\":\"09:00 AM\",\"endTime\":\"05:00 PM\"}', 'Active', '2026-08-06 08:39:36.427', '2026-08-06 08:39:36.427'),
('656f5469-e1be-4f9b-bc57-548298096c18', NULL, 'branch1', '03 Aug 2026', 'nishantsolanki3107@gmail.com', NULL, 'BHILGAON', 'AEST', '{\"startTime\":\"09:00\",\"endTime\":\"17:00\"}', 'Active', '2026-08-03 18:03:14.942', '2026-08-03 18:03:14.942'),
('6c6bd23f-e402-4b1a-81b5-6a8d681018ee', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'reh-1', '06 Aug 2026', 'reh@gmail.com', '7898456', 'lig squre', 'AEST', '{\"startTime\":\"08:00\",\"endTime\":\"18:30\"}', 'Active', '2026-08-06 08:44:09.910', '2026-08-06 08:44:09.910'),
('9e350a62-f7e3-46ce-a757-c502f47cade8', NULL, 'Test Live Branch', '03 Aug 2026', 'testbranch@ceotherapy.com.au', '+61 2 9999 8888', '45 Test St, Sydney', 'AEST (Sydney/Brisbane/Melbourne Standard)', '{\"startTime\":\"09:00 AM\",\"endTime\":\"05:00 PM\"}', 'Active', '2026-08-03 12:06:21.855', '2026-08-03 12:06:21.855'),
('cd407017-9c9b-4ef3-a2fa-25d3bb85f78e', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'Melbourne Wellness Branch', '20 Mar 2024', 'melbourne@ceotherapy.com.au', '+61 3 9876 5432', '100 Collins St, Melbourne VIC 3000', 'AEST (Sydney/Brisbane/Melbourne Standard)', '{\"startTime\":\"08:30 AM\",\"endTime\":\"05:30 PM\"}', 'Active', '2026-08-06 08:39:36.427', '2026-08-06 08:39:36.427'),
('e467ee38-338d-43b6-891c-0b680158c724', NULL, 'Melbourne Central Clinic', NULL, 'melbourne@zhealth.com', '+61 3 9000 1111', '123 Care Street, Melbourne VIC', 'AEDT', NULL, 'Active', '2026-07-31 06:39:21.590', '2026-07-31 06:39:21.590');

-- --------------------------------------------------------

--
-- Table structure for table `cancellation_reasons`
--

CREATE TABLE `cancellation_reasons` (
  `id` varchar(191) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cancellation_reasons`
--

INSERT INTO `cancellation_reasons` (`id`, `reason`, `active`, `createdAt`, `archived`) VALUES
('a88fa1a2-5511-4b19-a922-63fd5133c8be', 'Practitioner Cancelled', 1, '2026-08-03 05:38:13.509', 0),
('c7287db9-81e4-41bb-a01b-13cd92d505f8', 'Hospital Admission', 1, '2026-08-03 05:38:13.509', 0),
('e7be80b0-9dea-4bee-a595-3cfcd190cec7', 'No Show', 1, '2026-08-03 05:38:13.509', 0),
('f01fe2c0-8ccc-4d61-9dda-5e7396c82f6a', 'Sick', 1, '2026-08-03 05:38:13.509', 0);

-- --------------------------------------------------------

--
-- Table structure for table `client_tags`
--

CREATE TABLE `client_tags` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL DEFAULT '#8C4BFF',
  `iconName` varchar(191) NOT NULL DEFAULT 'TagOutlined',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `client_tags`
--

INSERT INTO `client_tags` (`id`, `name`, `color`, `iconName`, `createdAt`) VALUES
('0fdf47e3-37c8-4ecd-85c8-448d0c3f7982', 'fddfffffffff', '#F59E0B', 'TagOutlined', '2026-08-03 20:57:34.792'),
('583b36a8-0afb-43b2-9e98-3bad7b37c467', 'MERN STACK CERTIFICATE', '#3B82F6', 'TagOutlined', '2026-08-03 21:53:13.538'),
('c362ba4b-6276-4089-ac9d-3b19ab2a0563', 'op agrawal', '#64748B', 'TagOutlined', '2026-08-03 22:02:01.361'),
('e37c9f10-e505-4ab1-a6ae-3502dfcf1501', 'fdfd', '#3B82F6', 'TagOutlined', '2026-08-03 20:55:46.311');

-- --------------------------------------------------------

--
-- Table structure for table `clinics`
--

CREATE TABLE `clinics` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `logoUrl` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `contactPerson` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `patientsCount` int(11) DEFAULT 0,
  `referral` varchar(191) DEFAULT NULL,
  `revenue` double DEFAULT 0,
  `salesperson` varchar(191) DEFAULT NULL,
  `staffCount` int(11) DEFAULT 1,
  `state` varchar(191) DEFAULT NULL,
  `tier` varchar(191) DEFAULT 'Basic',
  `website` varchar(191) DEFAULT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `aiUsageCount` int(11) DEFAULT 0,
  `aiUsageLimit` int(11) DEFAULT 200,
  `featureFlags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`featureFlags`)),
  `lastBillingReset` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clinics`
--

INSERT INTO `clinics` (`id`, `name`, `email`, `phone`, `address`, `logoUrl`, `status`, `createdAt`, `updatedAt`, `contactPerson`, `country`, `patientsCount`, `referral`, `revenue`, `salesperson`, `staffCount`, `state`, `tier`, `website`, `displayId`, `aiUsageCount`, `aiUsageLimit`, `featureFlags`, `lastBillingReset`) VALUES
('249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'CEO Therapy111111111', 'contact@ceotherapy.com.au', '9752100980', 'Madhya Pradesh India', '/src/assets/logo2.png', 'Active', '2026-07-31 08:48:37.924', '2026-08-06 03:17:24.131', 'Nishant Solanki', 'New Zealand', 100, 'io', 1000, 'none', 5, 'Madhya Pradesh', 'Enterprise', 'www.ceotherapy.com.au', 'CLN-000001', 0, 200, '{\"workspaceUrl\":\"ceo-physio.splose.com\",\"patientTerminology\":\"Client\",\"currencyCode\":\"AUD\",\"currencySymbol\":\"A$\",\"defaultComms\":\"SMS & Email\",\"taxLabel\":\"ABN\",\"applyToExisting\":false,\"integrations\":[{\"id\":\"xero\",\"name\":\"Xero\",\"type\":\"Accounting\",\"connected\":true,\"lastSync\":\"8/4/2026, 1:00:10 AM\"},{\"id\":\"myob\",\"name\":\"MYOB\",\"type\":\"Accounting\",\"connected\":false,\"lastSync\":null},{\"id\":\"physitrack\",\"name\":\"Physitrack\",\"type\":\"Exercise Prescription\",\"connected\":true,\"lastSync\":\"8/4/2026, 1:13:11 AM\"},{\"id\":\"vald\",\"name\":\"VALD HUB\",\"type\":\"Exercise Prescription\",\"connected\":true,\"lastSync\":\"8/6/2026, 8:47:24 AM\"},{\"id\":\"stripe\",\"name\":\"Stripe\",\"type\":\"Payments\",\"connected\":true,\"lastSync\":\"8/5/2026, 2:47:27 AM\"},{\"id\":\"zoom\",\"name\":\"Zoom\",\"type\":\"Video Consultations\",\"connected\":false,\"lastSync\":null},{\"id\":\"gmeet\",\"name\":\"Google Meet\",\"type\":\"Video Consultations\",\"connected\":false,\"lastSync\":null},{\"id\":\"hicaps\",\"name\":\"HICAPS\",\"type\":\"Health Claiming\",\"connected\":true,\"lastSync\":\"8/4/2026, 1:13:21 AM\"},{\"id\":\"tyro\",\"name\":\"Tyro Health\",\"type\":\"Health Claiming\",\"connected\":true,\"lastSync\":\"8/4/2026, 1:13:24 AM\"}]}', '2026-07-31 21:56:35.071'),
('61d5bdfb-46e0-4d70-b4ba-f506ad731bb8', 'dfghj', 'vghjkl@gmail.com', 'dfghjk', 'Madhya Pradesh India', NULL, 'Suspended', '2026-08-02 21:59:39.972', '2026-08-02 22:00:40.615', 'yuio', 'India', 1, 'ghjk', 1, 'hjk', 1, 'Madhya Pradesh', 'Basic', 'ghjk', 'CLN-000003', 0, 200, NULL, NULL),
('9c1260c2-b6cc-4fd9-bfee-2be0c08a4b54', 'Nishant Solanki1111111111111111111111111111111111111111', 'nishantsolanki3107@gmail.com', 'dfghj', 'vgh ghjk', NULL, 'Suspended', '2026-08-05 06:30:23.328', '2026-08-05 11:47:15.367', 'vghj', 'ghjk', 100, 'fghj', 10, 'fghj', 10, 'vgh', 'Basic', 'ghjk', 'CLN-000005', 0, 200, NULL, NULL),
('9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4', 'REh-2', 'rohit2@gmail.com', '6266048785', 'MADHYAPRADESH india', NULL, 'Active', '2026-08-05 19:48:51.274', '2026-08-05 20:28:10.910', 'DR.rohit agrwal', 'india', 20, '0000000002', 100, 'none', 5, 'MADHYAPRADESH', 'Basic', 'rohit.com', 'CLN-000007', 0, 200, NULL, NULL),
('a6239bcf-45ec-4e20-8eff-e14e1810053e', 'reh-222', 'reh2@gmail.com', '81200793123', 'Madhya Pradesh india', NULL, 'Active', '2026-07-31 22:25:14.582', '2026-08-03 12:05:01.179', 'rohit agrawal', 'india', 100, 're', 300, 'none', 5, 'Madhya Pradesh', 'Pro', 'rohit .com', 'CLN-000002', 0, 200, NULL, '2026-07-31 22:26:17.042'),
('d8cce2ae-745e-4d2a-ab39-834043e42ccd', 'REH-1', 'rohit@gmail.com', '8120073190', 'madhyapradesh india', NULL, 'Active', '2026-08-05 19:08:50.977', '2026-08-05 21:07:58.846', 'dr.OP Agrawal', 'india', 100, '0000000001', 250, 'none', 10, 'madhyapradesh', 'Pro', 'rohit.com', 'CLN-000006', 0, 200, NULL, NULL),
('e71a6a03-2d8d-43ce-b9df-b3e785f917d0', 'Nishant Solanki555555555', 'nishantsolanki3107@gmail.com', '6266301555', NULL, NULL, 'Active', '2026-08-04 08:47:17.960', '2026-08-05 06:29:48.419', 'Nishant Solanki', NULL, 0, NULL, 10, 'Colin Edegbe', 1, NULL, 'Basic', NULL, 'CLN-000004', 0, 200, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `compliance_alerts`
--

CREATE TABLE `compliance_alerts` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `category` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `severity` varchar(191) NOT NULL DEFAULT 'Warning',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `compliance_alerts`
--

INSERT INTO `compliance_alerts` (`id`, `displayId`, `category`, `description`, `severity`, `status`, `createdAt`, `updatedAt`) VALUES
('b44d3bcc-60f4-49c9-abae-8d36b621e233', 'CA-000003', 'Access Control', '5 consecutive failed login attempts on admin account', 'Critical', 'Resolved', '2026-07-31 11:36:25.514', '2026-07-31 11:36:25.514'),
('b6049488-a795-4317-a686-663baadc1463', 'CA-000004', 'Retention Policy', 'Database logs older than 7 years auto-archived successfully', 'Info', 'Resolved', '2026-07-31 11:36:25.514', '2026-07-31 11:36:25.514');

-- --------------------------------------------------------

--
-- Table structure for table `consultation_notes`
--

CREATE TABLE `consultation_notes` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `patientName` varchar(191) NOT NULL,
  `practitionerId` varchar(191) DEFAULT NULL,
  `practitionerName` varchar(191) DEFAULT NULL,
  `profession` varchar(191) DEFAULT 'Physiotherapist',
  `appointmentId` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `soap` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`soap`)),
  `status` varchar(191) NOT NULL DEFAULT 'Draft',
  `date` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Other',
  `title` varchar(191) DEFAULT NULL,
  `occupation` varchar(191) DEFAULT NULL,
  `company` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `mobileNumber` varchar(191) DEFAULT NULL,
  `workPhone` varchar(191) DEFAULT NULL,
  `secondaryPhone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `postcode` varchar(191) DEFAULT NULL,
  `country` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `isMedicalReferrer` tinyint(1) NOT NULL DEFAULT 0,
  `associatedClients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`associatedClients`)),
  `noteLogs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`noteLogs`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `displayId`, `name`, `type`, `title`, `occupation`, `company`, `email`, `mobileNumber`, `workPhone`, `secondaryPhone`, `address`, `city`, `state`, `postcode`, `country`, `notes`, `isMedicalReferrer`, `associatedClients`, `noteLogs`, `createdAt`, `updatedAt`) VALUES
('0cdeb690-ae5a-4205-8905-74b11340818e', 'CON-000003', 'Test Doctor Contact', 'GP', NULL, NULL, 'Apollo Health', 'testdoctor@clinic.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'null', 'null', '2026-08-06 10:56:38.047', '2026-08-06 10:56:38.047'),
('8745e4df-7d09-4763-803d-f7e22a74c703', 'CON-000004', 'Dr. Rahul Sharma', 'Physiotherapist', NULL, NULL, 'Care Physio', 'rahul@health.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'null', 'null', '2026-08-06 10:56:47.378', '2026-08-06 10:56:47.378'),
('e11b5279-1797-487e-877a-41bf8650f6f5', 'CON-000002', 'Dr. Michael Chang', 'GP', 'Dr', 'General Practitioner', 'Melbourne Medical Centre', 'm.chang@melbmedical.com.au', '+61 411 222 333333333333333333333333333333333333', '+61 3 9123 4567', NULL, '45 Bourke St', 'Melbourne', 'VIC', '3000', 'Australia', 'Refers clients for physiotherapy & rehab.', 1, 'null', '[]', '2026-08-03 08:48:44.627', '2026-08-04 18:51:10.980');

-- --------------------------------------------------------

--
-- Table structure for table `data_management_logs`
--

CREATE TABLE `data_management_logs` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `fileName` varchar(191) NOT NULL,
  `target` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Success',
  `recordsProcessed` int(11) NOT NULL DEFAULT 0,
  `errors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`errors`)),
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `data_management_logs`
--

INSERT INTO `data_management_logs` (`id`, `displayId`, `type`, `fileName`, `target`, `status`, `recordsProcessed`, `errors`, `timestamp`, `createdAt`) VALUES
('332f77b0-bb3d-4ae9-922a-cb40adf85bc3', NULL, 'Export', 'clients_export_1785735116061.csv', 'Clients Register', 'Success', 2, '[]', '2026-08-03 05:31:56.066', '2026-08-03 05:31:56.066'),
('7c012787-70fe-4de9-954a-4e0ce5b8482b', NULL, 'Export', 'clients_export_1785734761746.csv', 'Clients Register', 'Success', 2, '[]', '2026-08-03 05:26:01.756', '2026-08-03 05:26:01.756'),
('984fdbdd-7d4c-40b7-880d-fa94b053b47c', NULL, 'Export', 'clients_export_1785794545805.csv', 'Clients Register', 'Success', 3, '[]', '2026-08-03 22:02:25.809', '2026-08-03 22:02:25.809'),
('c8502396-45a5-4ab0-86b6-d630aa9c139c', NULL, 'Export', 'clients_export_1785998902986.csv', 'Clients Register', 'Success', 4, '[]', '2026-08-06 06:48:22.994', '2026-08-06 06:48:22.994'),
('d6b31c3b-2555-4919-807d-fc144b6eea59', NULL, 'Export', 'invoices_export_1785998924415.pdf', 'Invoice Ledgers', 'Success', 14, '[]', '2026-08-06 06:48:44.419', '2026-08-06 06:48:44.419'),
('f69f7222-650a-47fc-8b2d-2a6d3d29c677', NULL, 'Export', 'clients_export_1785794021479.csv', 'Clients Register', 'Success', 3, '[]', '2026-08-03 21:53:41.485', '2026-08-03 21:53:41.485');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `patientName` varchar(191) NOT NULL,
  `sentTo` varchar(191) DEFAULT NULL,
  `uploadBy` varchar(191) NOT NULL DEFAULT 'Doctor Dr.APJ Kalam',
  `date` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Assessment',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `patientId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `name`, `patientName`, `sentTo`, `uploadBy`, `date`, `type`, `status`, `patientId`, `createdAt`, `updatedAt`) VALUES
('113d8475-05b7-487c-906d-d897b4f99ce4', 'Docname.doc', 'Zoya Clinic', 'Client John Miller', 'Clinic Admin', '2 Jan 2026', 'Assessment', 'Active', NULL, '2026-08-03 10:12:50.256', '2026-08-06 11:34:00.827'),
('1e6ffba2-975e-4c5a-9375-17d6c60a6a6b', 'Patient_Consent.pdf', 'Zoya Clinic', 'Client John Miller', 'Clinic Admin', '5 Jan 2026', 'Consent', 'Active', NULL, '2026-08-03 10:12:50.256', '2026-08-06 11:34:00.827'),
('22b6beb4-a005-4269-bb8e-094eca22a12d', 'Treatment_Plan.docx', 'Zoya Clinic', 'Client John Miller', 'Clinic Admin', '10 Jan 2026', 'Plan', 'Sent', NULL, '2026-08-03 10:12:50.256', '2026-08-03 10:12:50.256'),
('25b6dc90-8a95-459f-a2ed-90260b67b2cb', 'chini111111111111', 'trtrr', 'Client John Miller', 'Clinic Admin', '5 Aug 2026', 'Assessment', 'Active', NULL, '2026-08-04 18:41:30.225', '2026-08-06 11:34:00.827'),
('2b4abc00-43ff-489a-bd84-49e790eaa1a8', 'MERN STACK CERTIFICATE', 'dftyui', 'Client John Miller', 'Clinic Admin', '3 Aug 2026', 'Assessment', 'Sent', NULL, '2026-08-03 10:22:25.319', '2026-08-06 11:34:00.827'),
('41fd9f05-ea3c-4b7c-a5af-5ca54e7d6847', 'birth certifcate', 'SUJAL JAIN', 'Client John Miller', 'Clinic Admin', '6 Aug 2026', 'Assessment', 'Sent', NULL, '2026-08-06 11:29:27.237', '2026-08-06 11:34:00.827'),
('4caea76c-bbe4-41d7-900c-10ca54d2ecb7', 'cast certifivcate', 'SUJAL JAIN2', 'Client John Miller', 'Clinic Admin', '6 Aug 2026', 'Assessment', 'Active', NULL, '2026-08-06 12:17:32.014', '2026-08-06 12:17:32.014'),
('b7e1e187-ab1b-4f87-b716-26f56d944e7a', 'Referral_Letter.pdf', 'Melbourne Clinic', 'Dr. Sarah Jenkins', 'Clinic Admin', '15 Jan 2026', 'Referral', 'Draft', NULL, '2026-08-03 10:12:50.256', '2026-08-03 10:12:50.256'),
('fef49e13-bac2-43ba-98e1-7d1ed4d6c620', '3.jpeg', 'John Doe', NULL, 'Clinic Admin', 'Today', 'Uploaded Document', 'Active', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', '2026-08-05 06:26:53.923', '2026-08-06 11:34:00.827');

-- --------------------------------------------------------

--
-- Table structure for table `form_templates`
--

CREATE TABLE `form_templates` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Assessment',
  `lastModified` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `form_templates`
--

INSERT INTO `form_templates` (`id`, `name`, `category`, `lastModified`, `createdAt`) VALUES
('061e0eef-2611-4dc1-8c46-39e94ee9fe27', 'Demo', 'Clinical', '2026-08-03', '2026-08-03 05:57:31.316'),
('53b907fb-66be-42f4-b96d-c80235195fee', 'chini', 'Clinical', '2026-08-03', '2026-08-03 21:54:49.437'),
('6351b6a6-d01b-403b-9c21-2645da6eec39', 'form3', 'Clinical', '2026-08-06', '2026-08-06 03:17:48.497'),
('a87e733b-a974-4e35-b567-85aad8f1b726', 'Nishant Solanki11', 'Assessment', '2026-08-03', '2026-08-03 20:22:20.669'),
('b61e9a13-6881-40fd-8594-d333858496b7', 'Initial Assessment Form Test', 'Assessment', '2026-08-06', '2026-08-06 03:21:54.328'),
('c25794dd-3850-496f-8d66-556ffd714310', 'chini', 'Other', '2026-08-03', '2026-08-03 21:59:31.110'),
('d7cd9fd5-f1e0-46be-90d0-bba7abb32336', 'rohit eye hospital', 'Consent', '2026-08-03', '2026-08-03 21:54:10.799'),
('ea25ef1d-a535-40f3-b97f-a616596ef49f', 'form3', 'Clinical', '2026-08-06', '2026-08-06 03:18:24.756'),
('f7477c65-7ba5-4789-8e7c-d5fc266925f7', 'Inventory Asset', 'Other', '2026-08-03', '2026-08-03 21:59:00.944');

-- --------------------------------------------------------

--
-- Table structure for table `governance_logs`
--

CREATE TABLE `governance_logs` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `request` varchar(191) NOT NULL,
  `requester` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'Super Admin',
  `status` varchar(191) NOT NULL DEFAULT 'Completed',
  `type` varchar(191) NOT NULL DEFAULT 'CSV',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `governance_logs`
--

INSERT INTO `governance_logs` (`id`, `displayId`, `request`, `requester`, `role`, `status`, `type`, `createdAt`) VALUES
('2da57e42-d268-4f4f-93bd-625b46d68aeb', 'EX-000004', 'Full System Encrypted Backup Snapshot', 'Super Admin User', 'Super Admin', 'Completed', 'SQL', '2026-07-31 11:46:20.383'),
('3e786f8a-208f-48d2-bbb9-3bf7dca36bd0', 'EX-000001', 'Patient Demographics Export', 'Sarah Chen', 'Admin', 'Completed', 'CSV', '2026-07-31 11:36:25.513'),
('4675fe87-e11c-4454-90f9-431ea773148c', 'EX-000012', 'Full System Encrypted Backup Snapshot', 'Super Admin User', 'Super Admin', 'Completed', 'SQL', '2026-08-01 08:58:46.372'),
('4698527b-92ed-489f-926c-50b514c84257', 'EX-000009', 'Full System Encrypted Backup Snapshot', 'Super Admin User', 'Super Admin', 'Completed', 'SQL', '2026-08-01 08:55:30.142'),
('5e973b88-edc9-49c2-9591-3410078eddb6', 'EX-000013', 'Activity audit trails Export (Hillcrest Vision)', 'Super Admin User', 'Super Admin', 'Completed', 'JSON', '2026-08-01 08:59:07.244'),
('6a87189d-2e5a-4a28-9a31-05d5887938c9', 'EX-000003', 'Full System Encrypted Backup', 'System (Auto)', 'System', 'Completed', 'SQL', '2026-07-31 11:36:25.513'),
('83d5cfc6-2b77-4f5c-9079-72f480427e6b', 'EX-000005', 'Clinical Notes Ledger Export (Greenfield Health)', 'Super Admin User', 'Super Admin', 'Completed', 'JSON', '2026-07-31 11:48:34.933'),
('9cd86b11-5a2c-443a-a7ab-95b2dc1e7f98', 'EX-000011', 'Clinical Notes Ledger Export (Hillcrest Vision)', 'Super Admin User', 'Super Admin', 'Completed', 'CSV', '2026-08-01 08:56:40.339'),
('a0f2dc9c-9d28-4a06-b7b6-6d2403dbb5cb', 'EX-000007', 'Billing Ledger & Invoices Export (Hillcrest Vision)', 'Super Admin User', 'Super Admin', 'Completed', 'JSON', '2026-07-31 11:49:23.324'),
('c706ff73-9a86-4235-a6eb-947fee2daa0b', 'EX-000010', 'Patient Demographics Export (Bayview Family Clinic)', 'Super Admin User', 'Super Admin', 'Completed', 'JSON', '2026-08-01 08:56:04.567'),
('cba3d3e5-dd13-44a3-a27c-f49000ccaafa', 'EX-000006', 'Clinical Notes Ledger Export (Westend Wellness)', 'Super Admin User', 'Super Admin', 'Completed', 'JSON', '2026-07-31 11:48:59.810'),
('cfbe69ca-c466-412d-abff-580c6d64e003', 'EX-000008', 'Full System Encrypted Backup Snapshot', 'Super Admin User', 'Super Admin', 'Completed', 'SQL', '2026-08-01 08:44:15.454'),
('eb6a7d32-b218-4441-9241-d5657f1f4641', 'EX-000002', 'Billing Ledger Export', 'James Wilson', 'Admin', 'Completed', 'PDF', '2026-07-31 11:36:25.513'),
('ed136c7d-cc62-4afe-85c1-2970606cd41d', 'EX-000014', 'Full System Encrypted Backup Snapshot', 'Super Admin User', 'Super Admin', 'Completed', 'SQL', '2026-08-06 03:04:25.041');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` varchar(191) NOT NULL,
  `invoiceNumber` varchar(191) DEFAULT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `patientName` varchar(191) DEFAULT NULL,
  `issueDate` varchar(191) DEFAULT NULL,
  `dueDate` varchar(191) DEFAULT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `due` double NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Draft',
  `sentStatus` varchar(191) NOT NULL DEFAULT 'Not Sent',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `clientName` varchar(191) DEFAULT NULL,
  `practitionerName` varchar(191) DEFAULT NULL,
  `recipient` varchar(191) DEFAULT NULL,
  `service` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoiceNumber`, `patientId`, `patientName`, `issueDate`, `dueDate`, `amount`, `due`, `status`, `sentStatus`, `items`, `createdAt`, `updatedAt`, `displayId`, `clientName`, `practitionerName`, `recipient`, `service`) VALUES
('0739ffdf-c607-49bd-bef4-0cf927692472', 'INV-7014', NULL, 'Wynwood Wellness', '2026-05-08', '2026-05-15', 149, 0, 'Cancelled', 'Sent', NULL, '2026-07-31 12:22:32.100', '2026-08-03 09:29:36.341', 'INV-000004', 'Emma Watson', 'Dr. Sarah Jenkins', 'Plan Partners Co', NULL),
('197b7123-cc21-4b4b-8224-64e83fd3e9de', 'INV-7011', NULL, 'Lakeside Medical', '2026-05-10', '2026-05-17', 1200, 0, 'Paid', 'Sent', NULL, '2026-07-31 12:22:32.100', '2026-08-03 09:29:42.007', 'INV-000001', 'Liam Hemsworth', 'Dr. Alex Vance', 'Independent', NULL),
('1e0b3c44-9477-42a4-9fdb-94d70f83a30d', 'INV-7718', NULL, 'dfghj', '2026-08-02', '2026-08-03', 1, 1, 'Overdue', 'Not Sent', NULL, '2026-08-03 21:40:48.530', '2026-08-03 21:40:48.530', 'INV-000008', NULL, NULL, NULL, NULL),
('203c21e1-fb7b-493b-a18c-c9f0f97a64eb', 'INV-7834', NULL, 'REH-1', '2026-08-05', '2026-08-05', 4, 4, 'Overdue', 'Not Sent', NULL, '2026-08-05 19:08:50.994', '2026-08-05 19:08:50.994', 'INV-000013', NULL, NULL, NULL, NULL),
('20aeee12-4d96-46e6-b974-93a98736ff51', 'INV-8563', NULL, 'CEO Therapy111111111', '2026-07-31', '2026-08-03', 1000, 1000, 'Overdue', 'Not Sent', NULL, '2026-08-03 21:40:48.521', '2026-08-03 21:40:48.521', 'INV-000007', NULL, NULL, NULL, NULL),
('2881436f-190a-42f0-b121-d9dbedd299dd', 'INV-7012', NULL, 'Rosewood Physio', '2026-05-12', '2026-05-19', 349, 0, 'Paid', 'Not Sent', NULL, '2026-07-31 12:22:32.100', '2026-08-03 09:13:17.994', 'INV-000002', 'Olivia Wilde', 'Dr. Sarah Jenkins', 'Plan Partners Co', NULL),
('41eaf36f-ef51-489f-bed0-b71bb3b42fa4', 'INV-8106', NULL, 'REh-2', '2026-08-05', '2026-08-05', 150, 150, 'Overdue', 'Not Sent', NULL, '2026-08-05 19:48:51.295', '2026-08-05 19:48:51.295', 'INV-000014', NULL, NULL, NULL, NULL),
('504f7181-4769-4dbc-bcf6-52d420c4b283', 'INV-8087', NULL, 'Nishant Solanki555555555', '2026-08-04', '2026-08-05', 10, 10, 'Overdue', 'Not Sent', NULL, '2026-08-05 11:30:41.050', '2026-08-05 11:30:41.050', 'INV-000011', NULL, NULL, NULL, NULL),
('69d0cacc-952d-4d87-b2dc-e588abd53e0e', 'INV-000006', NULL, 'Emma Watson', '2026-08-03', '2026-08-10', 149, 149, 'Cancelled', 'Sent', 'null', '2026-08-03 09:21:16.018', '2026-08-03 09:24:53.948', 'INV-000006', 'Emma Watson', 'Dr. Sarah Jenkins', 'Plan Partners Co', 'MSK'),
('885d13d4-9753-4ec1-9229-586662ef834b', 'INV-8139', NULL, 'rohit eye hospital sapna sageeta ', '2026-08-05', '2026-08-05', 3, 3, 'Overdue', 'Not Sent', NULL, '2026-08-05 11:48:57.567', '2026-08-05 11:48:57.567', 'INV-000012', NULL, NULL, NULL, NULL),
('8a1798a9-e379-403b-b102-94958a9d74e4', 'INV-000015', NULL, 'suman jain', '2026-08-06', '2026-08-13', 200, 0, 'Paid', 'Sent', 'null', '2026-08-06 11:06:18.809', '2026-08-06 11:08:06.163', 'INV-000015', 'suman jain', 'dr.srejal', '0005', 'MSK'),
('99f7119b-1a67-4871-ae14-dd1d2596eef8', 'INV-8611', NULL, 'Nishant Solanki1111111111111111111111111111111111111111', '2026-08-05', '2026-08-05', 10, 10, 'Overdue', 'Not Sent', NULL, '2026-08-05 06:30:23.353', '2026-08-05 06:30:23.353', 'INV-000010', NULL, NULL, NULL, NULL),
('9dd151fb-4e64-4b56-8164-9ffa43b3f9af', 'INV-7015', NULL, 'Greenfield Health', '2026-05-05', '2026-05-12', 149, 0, 'Refunded', 'Not Sent', NULL, '2026-07-31 12:22:32.100', '2026-08-03 09:13:18.014', 'INV-000005', 'Liam Hemsworth', 'Dr. Alex Vance', 'Independent', NULL),
('d66f9ab9-e881-4b24-9fb1-715c2a5877da', 'INV-7013', NULL, 'Care Plus Clinic', '2026-05-12', '2026-05-19', 899, 0, 'Paid', 'Not Sent', NULL, '2026-07-31 12:22:32.100', '2026-08-03 09:13:18.020', 'INV-000003', 'Olivia Wilde', 'Dr. Sarah Jenkins', 'Plan Partners Co', NULL),
('f55850bf-dba3-4cfe-b374-27d3f9dd6cea', 'INV-8223', NULL, 'reh-222', '2026-07-31', '2026-08-03', 300, 300, 'Overdue', 'Not Sent', NULL, '2026-08-03 21:40:48.542', '2026-08-03 21:40:48.542', 'INV-000009', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `letter_templates`
--

CREATE TABLE `letter_templates` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Referrals',
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `letter_templates`
--

INSERT INTO `letter_templates` (`id`, `name`, `category`, `status`, `createdAt`) VALUES
('946175ca-6f9a-4444-ac8c-c3b9b2eae538', 'chini111', 'fg', 'archived', '2026-08-03 20:23:27.931'),
('a44f5672-89c1-45d0-bfd5-2c7cf1878b30', 'chini111 (Copy)', 'fg', 'active', '2026-08-04 22:08:32.246'),
('dc2f78b9-dcb2-4670-b892-cdc82a88d635', 'cvh', 'vbn', 'archived', '2026-08-04 22:07:43.152'),
('l_1', 'GP Medical Referral Letter', 'Referrals', 'active', '2026-08-03 20:22:01.364'),
('l_2', 'Discharge Summary Report', 'Discharge', 'active', '2026-08-03 20:22:01.364'),
('l_3', 'NDIS Plan Review Request', 'NDIS', 'active', '2026-08-03 20:22:01.364');

-- --------------------------------------------------------

--
-- Table structure for table `note_templates`
--

CREATE TABLE `note_templates` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `note_templates`
--

INSERT INTO `note_templates` (`id`, `name`, `content`, `createdAt`) VALUES
('2120a366-dea4-4246-8527-3159333f837d', 'fghjk', '', '2026-08-02 19:39:41.583'),
('397882fc-4cca-484b-8ea9-b0647123b06a', 'demo note', 'tyui', '2026-08-06 05:43:40.368');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `fullName` varchar(191) NOT NULL,
  `dob` varchar(191) DEFAULT NULL,
  `gender` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `postcode` varchar(191) DEFAULT NULL,
  `emergencyContactName` varchar(191) DEFAULT NULL,
  `emergencyContactPhone` varchar(191) DEFAULT NULL,
  `medicareNumber` varchar(191) DEFAULT NULL,
  `ndisNumber` varchar(191) DEFAULT NULL,
  `privateHealthFund` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `sessionsUsed` int(11) NOT NULL DEFAULT 0,
  `sessionsAllocated` int(11) NOT NULL DEFAULT 10,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `diagnosis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`diagnosis`)),
  `alerts` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `emergencyRelation` varchar(191) DEFAULT NULL,
  `gpClinic` varchar(191) DEFAULT NULL,
  `gpName` varchar(191) DEFAULT NULL,
  `gpPhone` varchar(191) DEFAULT NULL,
  `medicareExpiry` varchar(191) DEFAULT NULL,
  `medicareRef` varchar(191) DEFAULT NULL,
  `phiMemberNum` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `userId`, `fullName`, `dob`, `gender`, `email`, `phone`, `address`, `city`, `state`, `postcode`, `emergencyContactName`, `emergencyContactPhone`, `medicareNumber`, `ndisNumber`, `privateHealthFund`, `notes`, `sessionsUsed`, `sessionsAllocated`, `status`, `tags`, `diagnosis`, `alerts`, `createdAt`, `updatedAt`, `displayId`, `emergencyRelation`, `gpClinic`, `gpName`, `gpPhone`, `medicareExpiry`, `medicareRef`, `phiMemberNum`) VALUES
('11e3b79b-d624-4ad5-b35d-110bdffbaa60', '1dfafbeb-90a0-4396-9f57-6cfe1dd292a2', 'Emma Watson', '2026-08-26', 'Male', 'ftyu@gmail.com', '79523', 'rtyhjk', 'fghjk', 'Madhya Pradesh', '451228', '789543', '7854', NULL, NULL, NULL, NULL, 0, 10, 'Active', '[]', '[\"Parkinson\'s Disease\"]', NULL, '2026-08-03 06:57:00.762', '2026-08-06 10:44:28.437', 'CLI-000004', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('663001d8-6632-4470-a897-5d60467cb613', '82fe6dc8-dd95-4a0d-bf60-2683556f4cdb', 'Dr. Colin Edegbe111111111', '1980-01-01', 'Female', 'superadmin@gmail.com', '+61 97533694291', '124 Collins St', 'Sydney', 'NSW', '2000', 'Mary Miller', '+61 412 110 992', '3901 88124 1', NULL, 'Medibank Private', NULL, 0, 10, 'active', NULL, NULL, NULL, '2026-08-05 03:59:30.059', '2026-08-06 10:44:28.556', 'PAT-000004', 'Spouse', 'Collins Street Medical Group', 'Dr. Arthur Pendelton', '+61 3 9821 4410', '11/2028', '2', 'MBI-98214112'),
('a9f30fe1-c334-4ce0-a3f9-90d157236fde', '39845aac-e968-4e4f-a711-b634106379d6', 'John Doe', '1990-05-15', 'Male', 'patient@zhealth.com', '+61 400 999 888', '123 Main St', 'Melbourne', 'VIC', '3000', NULL, NULL, NULL, NULL, NULL, NULL, 2, 10, 'active', '{\"preferences\":{\"smsNotify\":false,\"emailNotify\":false,\"pushNotify\":false,\"tfaEnabled\":true}}', NULL, NULL, '2026-07-31 09:33:53.414', '2026-08-06 10:44:28.677', 'PAT-000001', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('dd47df65-702c-4315-b263-1d9104fc5553', NULL, '1.', '1990-05-15', 'Male', 'patient@zhealth.com', '+61 400 999 888', '123 Main St', 'Melbourne', 'VIC', '3000', NULL, NULL, NULL, NULL, NULL, NULL, 2, 10, 'active', '[]', '[\"Stroke\"]', 'null', '2026-07-31 06:39:21.586', '2026-08-04 18:54:06.311', 'CLI-000003', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('e3d2a328-df04-43cc-88e0-14352727c5c4', '7a99f812-9b54-462a-b4c4-184bb655ba07', 'suman jain', '2017-08-09', 'Male', 'sumanjain@gmail.com', '7854123', 'vijay nagar', 'vijay bnagae', 'madhyapradesh', '452002', NULL, NULL, NULL, NULL, NULL, NULL, 0, 10, 'Active', '[\"Medicare\"]', '[\"Stroke\"]', 'null', '2026-08-06 08:52:06.343', '2026-08-06 10:44:35.673', 'CLI-000005', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patient_claims`
--

CREATE TABLE `patient_claims` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `service` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `amount` varchar(191) NOT NULL,
  `funding` varchar(191) NOT NULL DEFAULT 'NDIS',
  `status` varchar(191) NOT NULL DEFAULT 'Approved',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_claims`
--

INSERT INTO `patient_claims` (`id`, `displayId`, `patientId`, `clinicId`, `service`, `date`, `amount`, `funding`, `status`, `createdAt`, `updatedAt`) VALUES
('285bc2d0-3312-4c86-a4d0-d454ea231a80', 'clm_3_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Speech Pathology consultation', '04 Jun 2026', '$150.00', 'EPC', 'Approved', '2026-08-06 10:48:40.464', '2026-08-06 10:48:40.464'),
('2aaca210-434a-4712-aa85-04b236f591bf', 'clm_1_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Initial Physiotherapy Assessment', '02 Jan 2026', '$180.00', 'NDIS', 'Approved', '2026-08-06 10:48:40.432', '2026-08-06 10:48:40.432'),
('2fe15a5d-8329-4098-9a63-72b51f7c4060', 'clm_3_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Speech Pathology consultation', '04 Jun 2026', '$150.00', 'EPC', 'Approved', '2026-08-05 10:45:11.931', '2026-08-05 10:45:11.931'),
('36e56993-ea1f-416e-9ca3-e046d42b9ff6', 'clm_4_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Active Core Mobilisation', '12 Jun 2026', '$120.00', 'NDIS', 'Processing', '2026-08-06 10:48:40.481', '2026-08-06 10:48:40.481'),
('51878efe-03f7-4470-be6a-1deb7e204f81', 'clm_4_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Active Core Mobilisation', '12 Jun 2026', '$120.00', 'NDIS', 'Processing', '2026-08-05 10:45:11.936', '2026-08-05 10:45:11.936'),
('6709afd8-d530-40c3-b22f-daba7d7d5b7f', 'clm_2', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Lumbar Spine Rehabilitation Exercise', '14 May 2026', '$120.00', 'NDIS', 'Approved', '2026-08-05 09:59:23.735', '2026-08-05 09:59:23.735'),
('81329d6f-16c1-4235-becd-de02de434355', 'clm_3', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Speech Pathology consultation', '04 Jun 2026', '$150.00', 'EPC', 'Approved', '2026-08-05 09:59:23.748', '2026-08-05 09:59:23.748'),
('8bc3d1c0-a6a4-470a-a763-d52441cc0ee3', 'clm_1', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Initial Physiotherapy Assessment', '02 Jan 2026', '$180.00', 'NDIS', 'Approved', '2026-08-05 09:59:23.728', '2026-08-05 09:59:23.728'),
('9fec2002-b9f3-474e-a21a-697648f80822', 'clm_2_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Lumbar Spine Rehabilitation Exercise', '14 May 2026', '$120.00', 'NDIS', 'Approved', '2026-08-05 10:45:11.920', '2026-08-05 10:45:11.920'),
('abf305f6-f967-4f77-aaf0-a59eb0ab74d0', 'clm_4', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Active Core Mobilisation', '12 Jun 2026', '$120.00', 'NDIS', 'Processing', '2026-08-05 09:59:23.752', '2026-08-05 09:59:23.752'),
('adf48018-6feb-4816-83b2-96e56d96b239', 'clm_1_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Initial Physiotherapy Assessment', '02 Jan 2026', '$180.00', 'NDIS', 'Approved', '2026-08-05 10:45:11.912', '2026-08-05 10:45:11.912'),
('beaa2a84-d05e-4bdb-ba8e-219b349f14e6', 'clm_2_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Lumbar Spine Rehabilitation Exercise', '14 May 2026', '$120.00', 'NDIS', 'Approved', '2026-08-06 10:48:40.445', '2026-08-06 10:48:40.445');

-- --------------------------------------------------------

--
-- Table structure for table `patient_forms`
--

CREATE TABLE `patient_forms` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `formData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`formData`)),
  `submittedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_forms`
--

INSERT INTO `patient_forms` (`id`, `patientId`, `clinicId`, `name`, `category`, `status`, `formData`, `submittedAt`, `createdAt`, `updatedAt`) VALUES
('1ad9650b-35b4-4b42-a2ec-b57efd7fd847', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'General Patient Consent & Treatment Acknowledgment', 'Consent', 'Completed', NULL, NULL, '2026-08-05 09:59:22.194', '2026-08-05 09:59:22.194'),
('2dfe2d90-2b20-4c8c-b334-22208416e997', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'ZealthOS Clinical Intake & Medical History Form', 'Intake', 'Pending', NULL, NULL, '2026-08-06 10:48:40.411', '2026-08-06 10:48:40.411'),
('3bc97e02-10de-4d56-9218-451ab3cf4ab8', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'ZealthOS Clinical Intake & Medical History Form', 'Intake', 'Pending', NULL, NULL, '2026-08-05 09:59:22.188', '2026-08-05 09:59:22.188'),
('55f80595-1806-4510-b865-06a1b7d80c71', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'ZealthOS Clinical Intake & Medical History Form', 'Intake', 'Pending', NULL, NULL, '2026-08-05 10:41:37.024', '2026-08-05 10:41:37.024'),
('5b9cbb3d-7097-4a7a-b8a4-d3dd90d684a7', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'NDIS Plan Participant Details & Service Agreement Form', 'NDIS', 'Pending', NULL, NULL, '2026-08-05 09:59:22.201', '2026-08-05 09:59:22.201'),
('63ee8cab-3daf-42e9-903e-f752dc77cd1e', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'NDIS Plan Participant Details & Service Agreement Form', 'NDIS', 'Pending', NULL, NULL, '2026-08-06 10:48:40.435', '2026-08-06 10:48:40.435'),
('65265443-a6d7-4eb7-a07c-8adf7c40f2c8', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'ODI (Oswestry Disability Index) Questionnaire', 'Outcome Measures', 'Completed', NULL, NULL, '2026-08-05 10:41:37.240', '2026-08-05 10:41:37.240'),
('7095e51c-2040-41ad-b2e4-5982441aed9d', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'General Patient Consent & Treatment Acknowledgment', 'Consent', 'Completed', NULL, NULL, '2026-08-05 10:41:37.195', '2026-08-05 10:41:37.195'),
('a15858aa-4d71-4860-ac43-82f60b666673', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'ZealthOS Clinical Intake & Medical History Form', 'Intake', 'Pending', NULL, NULL, '2026-08-05 09:59:22.192', '2026-08-05 09:59:22.192'),
('aed907a6-b3a3-4c0f-a391-afdd1cfc2155', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'ODI (Oswestry Disability Index) Questionnaire', 'Outcome Measures', 'Completed', NULL, NULL, '2026-08-05 09:59:22.204', '2026-08-05 09:59:22.204'),
('b34f1509-d4c3-49f3-b2c1-0f9d0ad33156', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'General Patient Consent & Treatment Acknowledgment', 'Consent', 'Completed', NULL, NULL, '2026-08-06 10:48:40.424', '2026-08-06 10:48:40.424'),
('c423ede4-b6d3-49a0-813c-d7db7a29f104', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'NDIS Plan Participant Details & Service Agreement Form', 'NDIS', 'Pending', NULL, NULL, '2026-08-05 09:59:22.203', '2026-08-05 09:59:22.203'),
('e93e11c3-8e65-4785-99ef-00dfb8b68782', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'General Patient Consent & Treatment Acknowledgment', 'Consent', 'Completed', NULL, NULL, '2026-08-05 09:59:22.199', '2026-08-05 09:59:22.199'),
('eaa67ea5-48a4-435a-b0fa-f5c3b5065885', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'NDIS Plan Participant Details & Service Agreement Form', 'NDIS', 'Pending', NULL, NULL, '2026-08-05 10:41:37.228', '2026-08-05 10:41:37.228'),
('f44c924b-85aa-44cf-8638-6c54d130419a', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'ODI (Oswestry Disability Index) Questionnaire', 'Outcome Measures', 'Completed', NULL, NULL, '2026-08-05 09:59:22.208', '2026-08-05 09:59:22.208'),
('f8d9b64a-46c3-40da-8120-80d5e3e76846', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'ODI (Oswestry Disability Index) Questionnaire', 'Outcome Measures', 'Completed', NULL, NULL, '2026-08-06 10:48:40.462', '2026-08-06 10:48:40.462');

-- --------------------------------------------------------

--
-- Table structure for table `patient_funding_accounts`
--

CREATE TABLE `patient_funding_accounts` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `remaining` varchar(191) NOT NULL,
  `percent` int(11) NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `used` varchar(191) NOT NULL,
  `total` varchar(191) NOT NULL,
  `expiry` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_funding_accounts`
--

INSERT INTO `patient_funding_accounts` (`id`, `patientId`, `clinicId`, `type`, `remaining`, `percent`, `status`, `used`, `total`, `expiry`, `createdAt`, `updatedAt`) VALUES
('315b3aac-cca7-418e-b5c2-f61503d6e2d4', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'NDIS Participant Care Plan', '$7,400.00', 65, 'Active', '$3,985.00', '$11,385.00', '31 Dec 2026', '2026-08-06 10:48:40.410', '2026-08-06 10:48:40.410'),
('4f3c57b0-14a5-4fe0-ba6c-521c6f1c6b6d', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Medicare EPC Program', '2 sessions', 40, 'Low Sessions', '3 of 5 sessions', '5 sessions', '14 Nov 2026', '2026-08-06 10:48:40.420', '2026-08-06 10:48:40.420'),
('651deecc-2232-41d3-8024-3af72b978d65', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Medicare EPC Program', '2 sessions', 40, 'Low Sessions', '3 of 5 sessions', '5 sessions', '14 Nov 2026', '2026-08-05 09:59:23.727', '2026-08-05 09:59:23.727'),
('864def2a-46f6-4097-bed6-3c73478452fb', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Medicare EPC Program', '2 sessions', 40, 'Low Sessions', '3 of 5 sessions', '5 sessions', '14 Nov 2026', '2026-08-05 09:59:23.723', '2026-08-05 09:59:23.723'),
('e1c8d4ce-8d71-4f4d-8439-13c22663324f', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'NDIS Participant Care Plan', '$7,400.00', 65, 'Active', '$3,985.00', '$11,385.00', '31 Dec 2026', '2026-08-05 09:59:23.719', '2026-08-05 09:59:23.719'),
('e8222b3b-3d4b-4a4a-912d-cf6ea670fd67', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'NDIS Participant Care Plan', '$7,400.00', 65, 'Active', '$3,985.00', '$11,385.00', '31 Dec 2026', '2026-08-05 10:41:37.023', '2026-08-05 10:41:37.023'),
('f1235af9-0094-450b-a87e-d256bd9936df', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'NDIS Participant Care Plan', '$7,400.00', 65, 'Active', '$3,985.00', '$11,385.00', '31 Dec 2026', '2026-08-05 09:59:23.718', '2026-08-05 09:59:23.718'),
('f67ca070-b77b-4be2-b0c6-4d54dc9dcf41', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Medicare EPC Program', '2 sessions', 40, 'Low Sessions', '3 of 5 sessions', '5 sessions', '14 Nov 2026', '2026-08-05 10:41:37.198', '2026-08-05 10:41:37.198');

-- --------------------------------------------------------

--
-- Table structure for table `patient_health_shares`
--

CREATE TABLE `patient_health_shares` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `clinic` varchar(191) NOT NULL,
  `practitioner` varchar(191) NOT NULL,
  `level` varchar(191) NOT NULL DEFAULT 'Limited Access',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `grantedDate` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_health_shares`
--

INSERT INTO `patient_health_shares` (`id`, `patientId`, `clinicId`, `clinic`, `practitioner`, `level`, `status`, `grantedDate`, `createdAt`, `updatedAt`) VALUES
('1e034438-8e09-4237-98eb-83ac54f22bd0', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'ABC Physiotherapy Care', 'John Smith', 'Limited Access', 'Pending', 'Just now', '2026-08-05 09:59:26.635', '2026-08-05 09:59:26.635'),
('44391f8f-73b7-4dad-9449-a2c3d52de767', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Sydney Allied Hub', 'Dr. Emily Smith', 'Limited Access', 'Active', '04 Mar 2026', '2026-08-05 09:59:26.623', '2026-08-05 09:59:26.623'),
('5c204b1b-593b-4977-bbde-a8c9cfe8b94b', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'ABC Physiotherapy Care', 'John Smith', 'Limited Access', 'Pending', 'Just now', '2026-08-05 09:59:26.631', '2026-08-05 09:59:26.631'),
('66bff114-1a62-4fcd-be3c-31c9e751431e', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Melbourne Allied Health', 'Dr. Sarah Jenkins', 'Full Access', 'Active', '12 Jan 2026', '2026-08-05 09:59:26.615', '2026-08-05 09:59:26.615'),
('7798d502-3d31-4e59-848c-593d4ff931c4', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Melbourne Allied Health', 'Dr. Sarah Jenkins', 'Full Access', 'Active', '12 Jan 2026', '2026-08-06 10:49:02.777', '2026-08-06 10:49:02.777'),
('a1f5bfed-d2d3-4fd8-9062-41c930fa4e7b', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Sydney Allied Hub', 'Dr. Emily Smith', 'Limited Access', 'Active', '04 Mar 2026', '2026-08-06 10:49:02.783', '2026-08-06 10:49:02.783'),
('c4257340-c853-4435-b85e-686daf29e43d', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Melbourne Allied Health', 'Dr. Sarah Jenkins', 'Full Access', 'Active', '12 Jan 2026', '2026-08-05 09:59:26.618', '2026-08-05 09:59:26.618'),
('c6055889-4a54-4385-8595-e5299bdc11f6', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'ABC Physiotherapy Care', 'John Smith', 'Limited Access', 'Pending', 'Just now', '2026-08-06 10:49:02.790', '2026-08-06 10:49:02.790'),
('f02234eb-efde-46db-9ab4-b5ae3c20cbac', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Sydney Allied Hub', 'Dr. Emily Smith', 'Limited Access', 'Active', '04 Mar 2026', '2026-08-05 09:59:26.631', '2026-08-05 09:59:26.631');

-- --------------------------------------------------------

--
-- Table structure for table `patient_invoices`
--

CREATE TABLE `patient_invoices` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `service` varchar(191) NOT NULL,
  `practitioner` varchar(191) NOT NULL,
  `due` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Unpaid',
  `paymentMethod` varchar(191) DEFAULT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_invoices`
--

INSERT INTO `patient_invoices` (`id`, `displayId`, `patientId`, `clinicId`, `service`, `practitioner`, `due`, `amount`, `status`, `paymentMethod`, `paidAt`, `createdAt`, `updatedAt`) VALUES
('03395a6c-5211-4ddb-bd98-912095e5ef2f', 'INV-1502_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Initial Physiotherapy Assessment', 'Dr. Sarah Jenkins', '02 Jan 2026', 180, 'Paid', NULL, NULL, '2026-08-06 10:48:40.462', '2026-08-06 10:48:40.462'),
('0fe34ced-0d4d-4194-9df2-0854c403e4bf', 'INV-1405', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'OT Assessment Session', 'Dr. James Carter', '10 May 2026', 190, 'Overdue', NULL, NULL, '2026-08-05 09:59:24.788', '2026-08-05 09:59:24.788'),
('14eec501-5446-4ea5-8d59-9c2cba9c16e6', 'INV-1405_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'OT Assessment Session', 'Dr. James Carter', '10 May 2026', 190, 'Overdue', NULL, NULL, '2026-08-06 10:48:40.471', '2026-08-06 10:48:40.471'),
('2c0d03a0-1fd2-4525-834f-3ba11f120c4b', 'INV-1712_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Hydrotherapy Session Assessment', 'Dr. Emily Smith', '04 Jun 2026', 150, 'Paid', NULL, NULL, '2026-08-05 10:45:12.102', '2026-08-05 10:45:12.102'),
('331d0d30-2df8-438f-a440-9d946bb82ef0', 'INV-1502_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Initial Physiotherapy Assessment', 'Dr. Sarah Jenkins', '02 Jan 2026', 180, 'Paid', NULL, NULL, '2026-08-05 10:45:12.108', '2026-08-05 10:45:12.108'),
('5b961b6f-22ae-4976-ad5f-09ad2c1dd458', 'INV-1829', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'MSK Review Consultation', 'Dr. Sarah Jenkins', '19 Jun 2026', 120, 'Unpaid', NULL, NULL, '2026-08-05 09:59:24.767', '2026-08-05 09:59:24.767'),
('60d9ca3d-5c09-4d38-9bf0-1160138b3ba8', 'INV-1712_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Hydrotherapy Session Assessment', 'Dr. Emily Smith', '04 Jun 2026', 150, 'Paid', NULL, NULL, '2026-08-06 10:48:40.443', '2026-08-06 10:48:40.443'),
('76d086f4-a39b-42ab-9e68-b4a4a6bc9581', 'INV-1829_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'MSK Review Consultation', 'Dr. Sarah Jenkins', '19 Jun 2026', 120, 'Unpaid', NULL, NULL, '2026-08-06 10:48:40.429', '2026-08-06 10:48:40.429'),
('7f82420a-c690-4e59-a062-e2c1e8435990', 'INV-1712', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Hydrotherapy Session Assessment', 'Dr. Emily Smith', '04 Jun 2026', 150, 'Paid', NULL, NULL, '2026-08-05 09:59:24.779', '2026-08-05 09:59:24.779'),
('c223f046-fcf3-4342-b359-9e2f045e7c6f', 'INV-1405_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'OT Assessment Session', 'Dr. James Carter', '10 May 2026', 190, 'Overdue', NULL, NULL, '2026-08-05 10:45:12.128', '2026-08-05 10:45:12.128'),
('dfdcc49d-61dd-4237-90f8-57dd2cfc8474', 'INV-1502', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Initial Physiotherapy Assessment', 'Dr. Sarah Jenkins', '02 Jan 2026', 180, 'Paid', NULL, NULL, '2026-08-05 09:59:24.784', '2026-08-05 09:59:24.784'),
('f4a1a98d-dc1b-4fb5-8ee2-0b0b8befcdc7', 'INV-1829_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'MSK Review Consultation', 'Dr. Sarah Jenkins', '19 Jun 2026', 120, 'Unpaid', NULL, NULL, '2026-08-05 10:45:12.088', '2026-08-05 10:45:12.088');

-- --------------------------------------------------------

--
-- Table structure for table `patient_outcome_measures`
--

CREATE TABLE `patient_outcome_measures` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `prevScore` varchar(191) DEFAULT NULL,
  `score` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Improved',
  `verifiedBy` varchar(191) DEFAULT NULL,
  `verifiedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_outcome_measures`
--

INSERT INTO `patient_outcome_measures` (`id`, `patientId`, `clinicId`, `name`, `type`, `prevScore`, `score`, `status`, `verifiedBy`, `verifiedAt`, `createdAt`, `updatedAt`) VALUES
('169a968e-0a10-4336-a201-db4892d41580', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'DASH (Disabilities of Arm, Shoulder & Hand)', 'Upper Limb', '—', '—', 'Not Tracked', NULL, NULL, '2026-08-05 09:59:20.405', '2026-08-05 09:59:20.405'),
('2f3e04e3-832e-40f8-9513-381a96418bc7', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Neck Disability Index (NDI)', 'Cervical Spine', '—', '—', 'Not Tracked', NULL, NULL, '2026-08-05 09:59:20.411', '2026-08-05 09:59:20.411'),
('7a55b9bb-8b61-43ee-91e1-29ee6a1ff7c2', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Oswestry Disability Index (ODI)', 'Lumbar Spine', '36% (Moderate Disability)', '18% (Minimal Disability)', 'Improved', 'Dr. Sarah Jenkins', NULL, '2026-08-05 09:59:20.397', '2026-08-05 09:59:20.397'),
('7c1ddd2b-b7f9-43df-be8e-70132b3e028f', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Oswestry Disability Index (ODI)', 'Lumbar Spine', '36% (Moderate Disability)', '18% (Minimal Disability)', 'Improved', 'Dr. Sarah Jenkins', NULL, '2026-08-06 10:48:53.542', '2026-08-06 10:48:53.542'),
('8232b0eb-797d-483f-930b-c37df0d47aea', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Oswestry Disability Index (ODI)', 'Lumbar Spine', '36% (Moderate Disability)', '18% (Minimal Disability)', 'Improved', 'Dr. Sarah Jenkins', NULL, '2026-08-05 09:59:20.395', '2026-08-05 09:59:20.395'),
('850152e4-ee66-43af-a749-cc64c8a03787', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'LEFS (Lower Extremity Functional Scale)', 'Lower Limb', '42 / 80 (Poor)', '68 / 80 (Good)', 'Improved', 'Dr. Sarah Jenkins', NULL, '2026-08-05 09:59:20.399', '2026-08-05 09:59:20.399'),
('858b6a7d-a90d-46b2-be1c-233307b3aa71', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Neck Disability Index (NDI)', 'Cervical Spine', '—', '—', 'Not Tracked', NULL, NULL, '2026-08-05 09:59:20.409', '2026-08-05 09:59:20.409'),
('aecf1439-cda4-40fc-b27d-371ec80858d5', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'LEFS (Lower Extremity Functional Scale)', 'Lower Limb', '42 / 80 (Poor)', '68 / 80 (Good)', 'Improved', 'Dr. Sarah Jenkins', NULL, '2026-08-06 10:48:53.547', '2026-08-06 10:48:53.547'),
('c14fe104-6b29-4942-9b6d-3bde0a974ddb', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'DASH (Disabilities of Arm, Shoulder & Hand)', 'Upper Limb', '—', '—', 'Not Tracked', NULL, NULL, '2026-08-05 09:59:20.405', '2026-08-05 09:59:20.405'),
('caeee1b2-c1b4-40bf-8007-45b7a209776b', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'DASH (Disabilities of Arm, Shoulder & Hand)', 'Upper Limb', '—', '—', 'Not Tracked', NULL, NULL, '2026-08-06 10:48:53.552', '2026-08-06 10:48:53.552'),
('f12e7d2c-aa04-48e3-97a9-6115d96e49ee', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Neck Disability Index (NDI)', 'Cervical Spine', '—', '—', 'Not Tracked', NULL, NULL, '2026-08-06 10:48:53.559', '2026-08-06 10:48:53.559'),
('ff1409eb-1759-4843-bd7a-fec61c315c73', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'LEFS (Lower Extremity Functional Scale)', 'Lower Limb', '42 / 80 (Poor)', '68 / 80 (Good)', 'Improved', 'Dr. Sarah Jenkins', NULL, '2026-08-05 09:59:20.402', '2026-08-05 09:59:20.402');

-- --------------------------------------------------------

--
-- Table structure for table `patient_progress_trends`
--

CREATE TABLE `patient_progress_trends` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `month` varchar(191) NOT NULL,
  `pain` int(11) NOT NULL DEFAULT 0,
  `function` int(11) NOT NULL DEFAULT 0,
  `mobility` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_progress_trends`
--

INSERT INTO `patient_progress_trends` (`id`, `patientId`, `clinicId`, `month`, `pain`, `function`, `mobility`, `createdAt`, `updatedAt`) VALUES
('16a7ef51-e986-48c5-a8bc-8e5fbbdfa445', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Mar', 6, 60, 68, '2026-08-06 10:48:53.518', '2026-08-06 10:48:53.518'),
('29fbfae3-bcc4-4c66-9f32-4c7e5fcb9ed7', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Jun', 2, 90, 92, '2026-08-05 09:59:20.392', '2026-08-05 09:59:20.392'),
('32f74341-5230-412d-8ef5-a2431f3b48a6', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Jun', 2, 90, 92, '2026-08-05 09:59:20.389', '2026-08-05 09:59:20.389'),
('37b50d6c-18d5-45cb-bc07-16e0f7744813', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Apr', 4, 75, 78, '2026-08-05 09:59:20.385', '2026-08-05 09:59:20.385'),
('4957ef8d-a650-4a6b-84aa-4b768bb4a59b', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Mar', 6, 60, 68, '2026-08-05 09:59:20.377', '2026-08-05 09:59:20.377'),
('49a3381f-0f90-447e-a5f0-067cd73e38e0', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Jan', 8, 30, 40, '2026-08-06 10:48:53.508', '2026-08-06 10:48:53.508'),
('579ae754-28fa-4a13-8919-59b1d4559b9b', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Apr', 4, 75, 78, '2026-08-05 09:59:20.382', '2026-08-05 09:59:20.382'),
('64d0e8cb-1bc1-4afe-8fa9-67f09233ed67', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Jun', 2, 90, 92, '2026-08-06 10:48:53.536', '2026-08-06 10:48:53.536'),
('69cec285-02ae-4dfa-b2b9-dd8146a0ce95', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'May', 3, 82, 85, '2026-08-06 10:48:53.531', '2026-08-06 10:48:53.531'),
('6eb79396-603f-4094-88ac-2cdc4e133e94', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Jan', 8, 30, 40, '2026-08-05 09:59:20.363', '2026-08-05 09:59:20.363'),
('7999a52e-dcbf-493b-b077-328a4f24e8ab', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Feb', 7, 45, 55, '2026-08-06 10:48:53.514', '2026-08-06 10:48:53.514'),
('a293c7df-ce5b-49ca-bbbe-04dcc4f86671', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Jan', 8, 30, 40, '2026-08-05 09:59:20.364', '2026-08-05 09:59:20.364'),
('c298f6ef-abd1-4aa7-9d64-a24f522716d4', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'May', 3, 82, 85, '2026-08-05 09:59:20.388', '2026-08-05 09:59:20.388'),
('cd4de347-578e-49a3-a326-3665420bd4c6', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Mar', 6, 60, 68, '2026-08-05 09:59:20.381', '2026-08-05 09:59:20.381'),
('cdfec722-457b-4030-a245-b78c1b8b45e6', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Feb', 7, 45, 55, '2026-08-05 09:59:20.368', '2026-08-05 09:59:20.368'),
('db1170e1-02a8-43c9-95a6-3c70ec2ea33c', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Apr', 4, 75, 78, '2026-08-06 10:48:53.527', '2026-08-06 10:48:53.527'),
('f8693f85-1f67-44d4-bdfa-e898a0ba1266', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'May', 3, 82, 85, '2026-08-05 09:59:20.386', '2026-08-05 09:59:20.386'),
('facb7d2e-5826-4a48-b91a-b18764e99af6', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Feb', 7, 45, 55, '2026-08-05 09:59:20.375', '2026-08-05 09:59:20.375');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` varchar(191) NOT NULL,
  `receiptNumber` varchar(191) NOT NULL,
  `clientName` varchar(191) NOT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `paymentDate` varchar(191) NOT NULL,
  `paymentMethod` varchar(191) NOT NULL DEFAULT 'Stripe / Credit Card',
  `invoiceReference` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Successful (Paid)',
  `transactionId` varchar(191) DEFAULT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `receiptNumber`, `clientName`, `amount`, `paymentDate`, `paymentMethod`, `invoiceReference`, `status`, `transactionId`, `patientId`, `createdAt`, `updatedAt`) VALUES
('0da49a43-3619-4a37-b077-6a484f7c1e20', 'RCPT-0380', 'Peter Bent', 264.64, '16 Jun 2026', 'Stripe / Credit Card', 'INV-0380', 'Successful (Paid)', 'tx_rcpt-0380_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('121771ac-8828-404f-9f3f-e81febfd0b75', 'RCPT-0396', 'rtyuiop', 79, '31 Aug 2026', 'Stripe / Credit Card', 'INV-0396', 'Successful (Paid)', 'tx_rcpt-0396_892', NULL, '2026-08-04 11:28:03.037', '2026-08-04 11:28:03.037'),
('219feb16-dd8a-4ed0-b1bf-f09aff20505e', 'RCPT-0398', 'ghj', 200, '27 Aug 2026', 'Stripe / Credit Card', 'INV-0398', 'Successful (Paid)', 'tx_rcpt-0398_892', NULL, '2026-08-04 18:47:21.276', '2026-08-04 18:47:21.276'),
('310bda38-c47c-43c4-a9b2-daa444b0a910', 'RCPT-0395', 'JOKER', 10, '31 Aug 2026', 'Stripe / Credit Card', 'INV-0395', 'Successful (Paid)', 'tx_rcpt-0395_892', NULL, '2026-08-04 11:19:07.447', '2026-08-04 11:19:07.447'),
('373e84bb-3136-4eca-9357-2fb7aa3fe56e', 'RCPT-0397', 'vi', 424.34, '31 Aug 2026', 'Stripe / Credit Card', 'INV-0397', 'Successful (Paid)', 'tx_rcpt-0397_892', NULL, '2026-08-04 18:44:12.548', '2026-08-04 18:44:12.548'),
('3a8553b2-a024-4235-aea0-694f3f67d177', 'RCPT-0377', 'Andrej Anastasov', 241.87, '19 Jun 2026', 'Stripe / Credit Card', 'INV-0377', 'Successful (Paid)', 'tx_rcpt-0377_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('3b6f723a-ed41-4b3d-9e94-5f430e58f06d', 'RCPT-0378', 'Alessia Sharpe', 232.24, '17 Jun 2026', 'Stripe / Credit Card', 'INV-0378', 'Successful (Paid)', 'tx_rcpt-0378_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('495eaab6-8813-4e88-bae6-59bcd9e943a5', 'RCPT-0379', 'Noah Lawrence', 257.71, '18 Jun 2026', 'Stripe / Credit Card', 'INV-0379', 'Successful (Paid)', 'tx_rcpt-0379_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('508ab990-e493-4c23-806b-a6edd914129f', 'RCPT-0383', 'Feras Taha', 187.5, '23 Jun 2026', 'Stripe / Credit Card', 'INV-0383', 'Successful (Paid)', 'tx_rcpt-0383_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('76760bb2-0afd-4146-882c-a9c75e6266e9', 'RCPT-0399', 'sujal jain', 200, '27 Aug 2026', 'Stripe / Credit Card', 'INV-0399', 'Successful (Paid)', 'tx_rcpt-0399_892', NULL, '2026-08-06 11:12:59.274', '2026-08-06 11:12:59.274'),
('a07908ff-53e7-450e-8791-5480dd1b5352', 'RCPT-0381', 'Liliana Radojcic', 229.99, '17 Jun 2026', 'Stripe / Credit Card', 'INV-0381', 'Successful (Paid)', 'tx_rcpt-0381_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('a39fdc38-510c-4cce-b81b-9f36464bf09a', 'RCPT-0375', 'Alessia Sharpe', 232.24, '15 Jun 2026', 'Stripe / Credit Card', 'INV-0375', 'Successful (Paid)', 'tx_rcpt-0375_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('b073c115-6d64-45c2-bc9f-07ca1a2962bf', 'RCPT-0382', 'Liam Eagles', 229.99, '16 Jun 2026', 'Stripe / Credit Card', 'INV-0382', 'Successful (Paid)', 'tx_rcpt-0382_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('b31a2e56-7efc-4e9c-b537-cc4d27ef1e43', 'RCPT-0370', 'Allan Schaudin', 213.99, '12 Jun 2026', 'Stripe / Credit Card', 'INV-0370', 'Successful (Paid)', 'tx_rcpt-0370_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163'),
('be71fda9-80a6-4c3c-bbb9-16664ce0de6d', 'RCPT-0394', 'nsihant solanki', 108, '19 Aug 2026', 'Stripe / Credit Card', 'INV-0394', 'Successful (Paid)', 'tx_rcpt-0394_892', NULL, '2026-08-03 09:40:47.395', '2026-08-03 09:40:47.395'),
('f3d98a09-55e3-4e97-ad57-12a7bb36f7f3', 'RCPT-0376', 'Peter Bent', 92, '19 Jun 2026', 'Stripe / Credit Card', 'INV-0376', 'Successful (Paid)', 'tx_rcpt-0376_892', NULL, '2026-08-03 09:40:05.163', '2026-08-03 09:40:05.163');

-- --------------------------------------------------------

--
-- Table structure for table `practitioners`
--

CREATE TABLE `practitioners` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `specialty` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL DEFAULT '#8C4BFF',
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `joinDate` varchar(191) DEFAULT NULL,
  `assignedBranches` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`assignedBranches`)),
  `qualifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`qualifications`)),
  `bio` text DEFAULT NULL,
  `consultationFee` double NOT NULL DEFAULT 0,
  `availability` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`availability`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `clinicId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `practitioners`
--

INSERT INTO `practitioners` (`id`, `userId`, `name`, `specialty`, `color`, `email`, `phone`, `status`, `joinDate`, `assignedBranches`, `qualifications`, `bio`, `consultationFee`, `availability`, `createdAt`, `updatedAt`, `clinicId`) VALUES
('35a9f370-6909-4038-aa94-5bc6afba77ab', NULL, 'Dr. Colin Edegbe', 'Physiotherapist', '#8C4BFF', 'sarah.jenkins@clinic.com', '+61 412 345 6780000000000000000000000', 'Active', '15 Jan 2024', '[\"NDIS\",\"CEO Therapy Mobile\"]', '[\"BPhty (Hons)\",\"AHPRA Registered\"]', 'Senior Musculoskeletal Physiotherapist', 150, NULL, '2026-08-04 19:57:22.158', '2026-08-04 20:07:11.091', NULL),
('47cceb18-21f6-4fe1-a6a9-686059c562b1', NULL, 'Dr. Colin Edegbe', 'Physiotherapisttttttttttttttttttttttt', '#8C4BFF', 'superadmin@gmail.com', '+61 412 345 678888888888', 'Active', '15 Jan 2024', '[\"NDIS\",\"CEO Therapy Mobile\"]', '[\"BPhty (Hons)\",\"AHPRA Registered\"]', 'Senior Musculoskeletal Physiotherapist', 150, NULL, '2026-08-04 19:53:52.170', '2026-08-04 22:09:20.105', NULL),
('819941b8-9d36-4ac4-a9da-6c1f012ae880', NULL, 'dr.srejal', 'Occupational Therapist', '#8C4BFF', 'shrejal@gmail.com', '785456', 'Active', '06 Aug 2026', '[\"6c6bd23f-e402-4b1a-81b5-6a8d681018ee\"]', '[]', 'oculoplast ', 20, '{\"Monday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Tuesday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Wednesday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Thursday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Friday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Saturday\":{\"available\":false,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Sunday\":{\"available\":false,\"startTime\":\"09:00\",\"endTime\":\"17:00\"}}', '2026-08-06 08:45:28.155', '2026-08-06 08:45:28.155', NULL),
('bd9ea6c1-51d7-4d46-854b-cedc2316394a', NULL, 'Dr. Sarah Jenkins', 'Physiotherapist', '#8C4BFF', 'sarah.jenkins@ceotherapy.com', '+61 412 100 001', 'Active', '15 Jan 2024', '[]', '[\"BPhty (Hons)\",\"AHPRA Registered\"]', 'Senior Musculoskeletal Physiotherapist with over 10 years experience.', 150, NULL, '2026-08-04 10:51:30.216', '2026-08-04 10:51:30.216', NULL),
('c6aa7e02-e1a0-4392-a8c5-cfe4cd84c7e6', NULL, 'Dr. Alex Vance', 'Occupational Therapist', '#30D2BE', 'alex.vance@ceotherapy.com', '+61 412 100 002', 'Active', '10 Feb 2024', '[]', '[\"MOccThy\",\"NDIS Registered Provider\"]', 'Specialist in rehabilitation and neurological Occupational Therapy.', 165, NULL, '2026-08-04 10:51:30.216', '2026-08-04 10:51:30.216', NULL),
('f5a35a83-ff13-4f86-89aa-8f3341e91668', NULL, 'dr.radheshayam verma', 'Occupational Therapist', '#8C4BFF', 'nishantsol0@gmail.com', '7895456', 'Active', '04 Aug 2026', '[\"656f5469-e1be-4f9b-bc57-548298096c18\"]', '[]', NULL, 10, '{\"Monday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Tuesday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Wednesday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Thursday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Friday\":{\"available\":true,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Saturday\":{\"available\":false,\"startTime\":\"09:00\",\"endTime\":\"17:00\"},\"Sunday\":{\"available\":false,\"startTime\":\"09:00\",\"endTime\":\"17:00\"}}', '2026-08-04 10:59:39.466', '2026-08-04 10:59:39.466', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prescribed_exercises`
--

CREATE TABLE `prescribed_exercises` (
  `id` varchar(191) NOT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `treatmentPlanId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `reps` varchar(191) NOT NULL,
  `note` varchar(191) DEFAULT NULL,
  `done` tinyint(1) NOT NULL DEFAULT 0,
  `img` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prescribed_exercises`
--

INSERT INTO `prescribed_exercises` (`id`, `patientId`, `treatmentPlanId`, `name`, `reps`, `note`, `done`, `img`, `createdAt`, `updatedAt`) VALUES
('3511c557-0a8f-49a2-9a34-8afc2b370a20', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Ankle resistance bands flexion', '3 sets of 12 reps', 'Use purple resistance band.', 0, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=200', '2026-08-06 10:48:40.466', '2026-08-06 10:48:40.466'),
('360b0a40-3b9a-48e7-a86b-97d1602d3a4a', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Hamstring eccentric stretches', '3 sets of 10 reps', 'Keep knees straight. Lean forward slowly.', 0, 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=200', '2026-08-06 10:48:40.452', '2026-08-06 10:48:40.452'),
('3c6a01b0-6c75-49a5-a225-29449279495e', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Lumbar stretching extensions', 'Hold 30 secs, 5 reps', 'Stretch gently. Stop immediately if pain spikes.', 1, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200', '2026-08-06 10:48:40.435', '2026-08-06 10:48:40.435'),
('4be9978f-8101-4c10-a693-e1a596c26997', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Double leg calf raises', '3 sets of 15 reps', 'Rest 60 seconds between sets.', 1, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:37:45.061', '2026-08-05 10:37:45.061'),
('72d6ce83-a1a0-424c-be59-adc82328fd3b', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Ankle resistance bands flexion', '3 sets of 12 reps', 'Use purple resistance band.', 0, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:37:45.096', '2026-08-05 10:37:45.096'),
('925df49e-975c-49f9-8372-a4cc6430ec39', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Hamstring eccentric stretches', '3 sets of 10 reps', 'Keep knees straight. Lean forward slowly.', 0, 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:41:37.297', '2026-08-05 10:41:37.297'),
('b40d8e18-f2af-4ab6-b61f-ae85a013f896', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Lumbar stretching extensions', 'Hold 30 secs, 5 reps', 'Stretch gently. Stop immediately if pain spikes.', 1, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:41:37.272', '2026-08-05 10:41:37.272'),
('b904f6bb-2c80-415a-8f26-8902fefb66f4', 'e3d2a328-df04-43cc-88e0-14352727c5c4', NULL, 'Double leg calf raises', '3 sets of 15 reps', 'Rest 60 seconds between sets.', 1, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200', '2026-08-06 10:48:40.427', '2026-08-06 10:48:40.427'),
('bbd6f5f5-ce8b-4e92-9b42-c9356e4efeb1', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Double leg calf raises', '3 sets of 15 reps', 'Rest 60 seconds between sets.', 1, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:41:37.259', '2026-08-05 10:41:37.259'),
('c4ffa061-b808-45e7-a967-2bd98ce8774f', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Lumbar stretching extensions', 'Hold 30 secs, 5 reps', 'Stretch gently. Stop immediately if pain spikes.', 1, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:37:45.078', '2026-08-05 10:37:45.078'),
('ce950707-9dff-490b-b6b9-dc53d157a280', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', NULL, 'Ankle resistance bands flexion', '3 sets of 12 reps', 'Use purple resistance band.', 0, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:41:37.308', '2026-08-05 10:41:37.308'),
('e6310c4c-3031-4476-b34e-c6ab13942378', '663001d8-6632-4470-a897-5d60467cb613', NULL, 'Hamstring eccentric stretches', '3 sets of 10 reps', 'Keep knees straight. Lean forward slowly.', 0, 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=200', '2026-08-05 10:37:45.086', '2026-08-05 10:37:45.086');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) DEFAULT NULL,
  `description` varchar(191) DEFAULT NULL,
  `itemCode` varchar(191) DEFAULT NULL,
  `vendor` varchar(191) DEFAULT NULL,
  `tax` varchar(191) DEFAULT 'GST Free Income',
  `xeroAccount` varchar(191) DEFAULT '200 - Sales',
  `price` double NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `clinicId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `displayId`, `name`, `category`, `description`, `itemCode`, `vendor`, `tax`, `xeroAccount`, `price`, `stock`, `archived`, `createdAt`, `updatedAt`, `clinicId`) VALUES
('5f065061-e429-4211-9bae-db10376d086f', 'PROD-002', 'MERN STACK CERTIFICATE1111', 'Count', 'ertyh', '79456', 'durgesh', 'GST Free Income', '200 - Sales', 10, 11, 1, '2026-08-03 09:51:31.323', '2026-08-03 09:52:44.964', NULL),
('8a98890f-d1a6-441f-b86d-534c4a8a5a84', 'PROD-003', 'MERN STACK CERTIFICATE1111', 'Count', 'rtyui', 'rtyui', 'dfg', 'GST Free Income', '200 - Sales', 100, 1, 1, '2026-08-04 11:22:07.243', '2026-08-04 11:25:51.011', NULL),
('c458b412-ff13-4f09-a9af-1a24f7ca4e11', 'PROD-004', 'alpha injection11', 'injction', 'alpha injecton', '123456', 'deelip bhiya', 'GST Free Income', '200 - Sales', 10, 2, 1, '2026-08-06 11:14:42.920', '2026-08-06 11:15:34.604', NULL),
('df3c145a-b46b-4315-be90-fdacd75ad282', 'PROD-001', 'Hand Theraputty', 'Core - Consumables', NULL, '03_040000911_0103_1_1', 'MedSupply Co', 'GST Free Income', '200 - Sales', 15, 9, 1, '2026-08-03 09:49:39.188', '2026-08-03 09:52:58.611', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` varchar(191) NOT NULL,
  `token` varchar(500) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `token`, `userId`, `expiresAt`, `createdAt`) VALUES
('00a894a9-0b9a-4dbc-a6f4-abce4e6e1402', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YTk5ZjgxMi05YjU0LTQ2MmEtYjRjNC0xODRiYjY1NWJhMDciLCJlbWFpbCI6InN1bWFuamFpbkBnbWFpbC5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc4NjAyNDQ1MCwiZXhwIjoxNzg2NjI5MjUwfQ.Y0MaGSHKqlWezYIdx-0rL6bBPuKp45HF6Ss8X9EPXlo', '7a99f812-9b54-462a-b4c4-184bb655ba07', '2026-08-13 13:54:10.015', '2026-08-06 13:54:10.018'),
('075c8afe-d2d7-47cf-a7d3-4e7486350afd', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc4NzQ3MSwiZXhwIjoxNzg2MzkyMjcxfQ.qzyTMKEHCdBSWQVjp88kBFkcY8vuivfVhQ4jcxsVMVc', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 20:04:31.330', '2026-08-03 20:04:31.333'),
('0eb08f0e-93ce-44a9-bd26-0da1db4e9950', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTg1ODYxLCJleHAiOjE3ODY1OTA2NjF9.2E6fNvaaEXV1SC2kufYl500hOCJHnkkr2F8anpYEOyM', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 03:11:01.470', '2026-08-06 03:11:01.475'),
('12cf3d88-beb5-42e0-8b88-5cf2b87084c6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTg2NTE0LCJleHAiOjE3ODY1OTEzMTR9.za7CEJCHQLU0l2PHHt3q5CqrieDJNm0R_k3Kb8V_OKA', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 03:21:54.300', '2026-08-06 03:21:54.303'),
('13d774ef-fe39-44b1-8fb1-8003799a6b05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1NzA1OSwiZXhwIjoxNzg2MzYxODU5fQ.YeftAU65iNv0fZhqgBHuQrvBR6Bx5pqEz0kpKzT3lVs', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 11:37:39.266', '2026-08-03 11:37:39.267'),
('1a4e05c2-88e9-4d93-a2a2-37150ecc25e2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTczNzM4MywiZXhwIjoxNzg2MzQyMTgzfQ.4fpTI5qQg-tPi7cu5k_H2Gizk-jErZjViJubiFn2PW8', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 06:09:43.698', '2026-08-03 06:09:43.701'),
('1aea9343-66e2-49b4-bd46-22db8b8cd0a6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc4NDY0NSwiZXhwIjoxNzg2Mzg5NDQ1fQ.wtsPzSJSrEyC3L_3V37clXEXbHuxw808pmg-vTWfrYo', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 19:17:25.468', '2026-08-03 19:17:25.473'),
('1b0c6c5a-8a83-4703-b0f7-1ed75630a841', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTk5NTgwMCwiZXhwIjoxNzg2NjAwNjAwfQ.Gug--fuFvYv-ueibR06hUnwlU8HcbMlABlvuHxDipKY', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-13 05:56:40.037', '2026-08-06 05:56:40.038'),
('1c7368a1-4da2-4984-a74a-e5757266039f', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTkzMTAzMSwiZXhwIjoxNzg2NTM1ODMxfQ.mVaBwDIYxiVOPZxj0E8hn3dxofsQ7r3qgm0ciWmeU80', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-12 11:57:11.677', '2026-08-05 11:57:11.680'),
('24c17e29-7c5d-4611-a1b9-141535fd93f1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1ODM3NiwiZXhwIjoxNzg2MzYzMTc2fQ.qtWrpNa6W24SexZCILgcVZvIDR7rstXcBiA7dXeCoWY', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 11:59:36.673', '2026-08-03 11:59:36.676'),
('26447339-1daa-4ebb-ba46-68a9eee1ec31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTg0MDUyMSwiZXhwIjoxNzg2NDQ1MzIxfQ.9ondzd5C2V6DFNmT_0KZ9iduXMbF-ya6S2urGXb1mcU', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 10:48:41.829', '2026-08-04 10:48:41.833'),
('277895df-633e-4826-8d16-437e05160cfd', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMjI4NTAsImV4cCI6MTc4NjYyNzY1MH0.udiEXvGjlcDnD5OOhRPCbAxFKK6m9p3RwstgTD-MFis', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 13:27:30.829', '2026-08-06 13:27:30.830'),
('2a542dec-3bcd-4ff1-ad72-20bd436b6f37', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc4MjUzMywiZXhwIjoxNzg2Mzg3MzMzfQ.dL_NguqcwVKPgeHg1gJn1qK4X0ZBaljs2Omp8u98vYA', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 18:42:13.881', '2026-08-03 18:42:13.886'),
('2abba36e-e0e4-4321-8e27-bc8a98a5dcb4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg2MDAyNTkxLCJleHAiOjE3ODY2MDczOTF9._I9wIIJWvh4DntaQu93yAgtexoZSpkPNLczKpgx9OY0', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 07:49:51.942', '2026-08-06 07:49:51.945'),
('2b6e20e4-dc77-4a81-985d-52ae9f33eb17', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc4NTM5NywiZXhwIjoxNzg2MzkwMTk3fQ.5GjRDssh7st-TGJw9raXeE-59zttgz7TFc1YdN2LfV4', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 19:29:57.290', '2026-08-03 19:29:57.299'),
('2e3932cb-864f-4058-a797-87257a7b26be', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc5MzY0OSwiZXhwIjoxNzg2Mzk4NDQ5fQ.8IEjpMCPzqLtnXnSjL_bfRFQNgxFqpr43aRPUqJvjcM', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 21:47:29.381', '2026-08-03 21:47:29.383'),
('2f677233-1bcb-42d1-a36a-f4ebbc1576b7', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTgzMzkyLCJleHAiOjE3ODY1ODgxOTJ9.GYAGsS50c4MvZc0pATkfPgPu9BJsmrOARRhrO7dJONs', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 02:29:52.771', '2026-08-06 02:29:52.773'),
('376694a2-eee3-4eae-9767-b8ec7cb44ed1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1NzIxOCwiZXhwIjoxNzg2MzYyMDE4fQ.jeWk9y329iwAbMhZ4OcM1HqznbARvuRQ59NVhlhI_yM', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 11:40:18.650', '2026-08-03 11:40:18.652'),
('397147d9-fb22-484b-aa6e-acc50d505280', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTkyNzU1OCwiZXhwIjoxNzg2NTMyMzU4fQ.w0aVRyEkIWlhyTswdudX19_I9dKWcVNz4L75GmjFiCA', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-12 10:59:18.405', '2026-08-05 10:59:18.407'),
('3b523be7-0f0c-4b68-8c60-e73f50a9c111', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzM5NiwiZXhwIjoxNzg2NDQyMTk2fQ.872Vww2V16tjlQwiGflfTepzK_6iMvwAo62VLR2_n8I', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 09:56:36.652', '2026-08-04 09:56:36.654'),
('3cb4f0ff-b06b-46be-bdf7-01102e597412', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NjAxNDEzMywiZXhwIjoxNzg2NjE4OTMzfQ.G-d_STsaNy_4GmybXSVPf0G84znG6EIE5AXWDZ-8M9E', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-13 11:02:13.553', '2026-08-06 11:02:13.556'),
('3f23a892-9c2d-42d2-9551-acbc365a4f0c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1ODgxMywiZXhwIjoxNzg2MzYzNjEzfQ.GmjfSLXzz4PxksVxIi3rw7jBCMDg8xcEbwRvekwuwiw', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 12:06:53.463', '2026-08-03 12:06:53.471'),
('405ff547-1275-4bb7-bd30-ef7e4e0ddfa5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTk0NTIyLCJleHAiOjE3ODY1OTkzMjJ9.gXorwVwcuYZBexnfnfj8L3EH6FqYPHxKWbkye2biofk', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 05:35:22.849', '2026-08-06 05:35:22.853'),
('41eab307-0474-4648-b2ab-30e4554f6f76', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMjI4MjQsImV4cCI6MTc4NjYyNzYyNH0.JHLVeXt4eMqeGGmkLkvkI5IZCN3__p2j4xzsaKZVF9U', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 13:27:04.455', '2026-08-06 13:27:04.456'),
('56ea1ead-b64e-4f78-bb70-3fa3354ac221', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTkzMDYwOCwiZXhwIjoxNzg2NTM1NDA4fQ.lHEyYVSAY1Q5KrlRSUYlXbqwkAS9kcwPvr--xjFKdKM', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-12 11:50:08.401', '2026-08-05 11:50:08.404'),
('61f333fa-cad9-43e1-bdfb-423090a447d8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODU5NTcwNDQsImV4cCI6MTc4NjU2MTg0NH0.mzMecdIbgmVp3QVNoCDCTK8iWo8lv3Mxdn-TiOCm0-M', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-12 19:10:44.240', '2026-08-05 19:10:44.243'),
('62c37416-46e9-4fc6-803d-cbae19b13907', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzg3MiwiZXhwIjoxNzg2NDQyNjcyfQ.n4C7cBGBBsxlFA-Wehr8eW2JNDi7AnyNwazDDZFqcc0', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 10:04:32.733', '2026-08-04 10:04:32.734'),
('63661941-3372-485f-abfb-fa20dc1b711d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzE0MiwiZXhwIjoxNzg2NDQxOTQyfQ.TEI-EU0ik8KOJWUX7h4eNt1hGEt0gtnSTOJdoKpxLCY', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 09:52:22.575', '2026-08-04 09:52:22.578'),
('665ef5e5-a30c-43c2-8423-ddb90d37d261', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMTgyODcsImV4cCI6MTc4NjYyMzA4N30.gxf5_XJKJaztg_xi-2BD2fTQ-H1DwTVd6ISo-aARL00', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 12:11:27.737', '2026-08-06 12:11:27.738'),
('74f02b95-475f-4c06-864c-68bec037c662', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1OTI0MywiZXhwIjoxNzg2MzY0MDQzfQ.TJlLq4qdiwJnVQF-fCn5ltiuni_6xG71RBy02tDSVIU', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 12:14:03.755', '2026-08-03 12:14:03.757'),
('7929ff86-8018-498d-94bd-031558b7a3ef', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YTk5ZjgxMi05YjU0LTQ2MmEtYjRjNC0xODRiYjY1NWJhMDciLCJlbWFpbCI6InN1bWFuamFpbkBnbWFpbC5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc4NjAxMzMyMCwiZXhwIjoxNzg2NjE4MTIwfQ.PnCwd-wRD0j8ksL2eYOwIuJ0LDWl1ADLIr7uW2NpUuc', '7a99f812-9b54-462a-b4c4-184bb655ba07', '2026-08-13 10:48:40.175', '2026-08-06 10:48:40.176'),
('80708aa1-ccc3-4e80-8ae8-5df94b7c9af7', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc5Mzc3NywiZXhwIjoxNzg2Mzk4NTc3fQ.S6xMFVoLbtgHG2WYROVlqZvdN7Yi_ggROOvjih3lvEA', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 21:49:37.577', '2026-08-03 21:49:37.581'),
('845d8ec9-0d42-4bdf-9d25-87932de17f7e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTk1MDc3LCJleHAiOjE3ODY1OTk4Nzd9.ky5WqYwCF5Y4RDERZklWsEqcmGTA329MV0owN2g_fnE', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 05:44:37.216', '2026-08-06 05:44:37.217'),
('8be48507-7851-44bf-be3c-7299767ad5f5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc3ODYzOCwiZXhwIjoxNzg2MzgzNDM4fQ.wlsaz13GCvsBVuJhVstgnPMy1KIyDlbjCL6YRY4iFIc', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 17:37:18.817', '2026-08-03 17:37:18.819'),
('8d8136ce-8085-443b-8870-ad9333baaf09', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMDY3NTMsImV4cCI6MTc4NjYxMTU1M30.GIxe9TwdrGCyzXNqdqujGsqR4NnAYuV6wLRSyblYf-c', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 08:59:13.295', '2026-08-06 08:59:13.297'),
('903c2e09-cacf-4226-869b-f63f34f7b079', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMDUzODYsImV4cCI6MTc4NjYxMDE4Nn0.djRRBJ1aHLgpQk0bcm_1iEsNEacbp6Qk3HWZN0dwH94', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 08:36:26.195', '2026-08-06 08:36:26.197'),
('92f654c8-26f7-4e77-8a5c-965ee5264152', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YTk5ZjgxMi05YjU0LTQ2MmEtYjRjNC0xODRiYjY1NWJhMDciLCJlbWFpbCI6InN1bWFuamFpbkBnbWFpbC5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc4NjAxMzA4OSwiZXhwIjoxNzg2NjE3ODg5fQ.X_aY_WqrjnsmSWIVXfch4sMObAyNNp6oxpXxo0Pp2h4', '7a99f812-9b54-462a-b4c4-184bb655ba07', '2026-08-13 10:44:49.429', '2026-08-06 10:44:49.432'),
('a04aec97-aa8e-4da3-ae9c-d6b1d9e00e01', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTk5NTA1MSwiZXhwIjoxNzg2NTk5ODUxfQ._7RVCE-NUGPlm2NKi0KFslTh9xASjGJusyoC4h0dV6M', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-13 05:44:11.669', '2026-08-06 05:44:11.671'),
('a193f48c-7687-4128-8bd1-306ea9748a3b', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg2MDA1MjAyLCJleHAiOjE3ODY2MTAwMDJ9.gppXQjHWzOBDbQ8iJgZNdpmpCh5RcbarKYWz2ZVG82I', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 08:33:22.334', '2026-08-06 08:33:22.336'),
('a3fe457d-bfed-4d30-aa2c-dd3397368092', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg2MDIwMjkzLCJleHAiOjE3ODY2MjUwOTN9.KO_23H7lbsy8MinFrd36X-eWUYZ6rzVoujTfQNHw9zA', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 12:44:53.851', '2026-08-06 12:44:53.853'),
('a5d6ab11-5e5e-4986-80b7-ae2296746f79', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMjI1NTQsImV4cCI6MTc4NjYyNzM1NH0.-6aovpv-B0DFgbkfC7eJQAodAu4lLMY4xt2r-g52vAQ', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 13:22:34.469', '2026-08-06 13:22:34.472'),
('ade2d1f2-be35-47c4-ac94-a52d08a83f71', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1Njg1MiwiZXhwIjoxNzg2MzYxNjUyfQ.CyKY0atWCtewFsnK8b5zjmj2GCJZ_18fyJa_zyWssXU', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 11:34:12.782', '2026-08-03 11:34:12.785'),
('b2f82dd9-39e4-4f70-91da-50d01c3997a1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NjAxOTQyMiwiZXhwIjoxNzg2NjI0MjIyfQ.cLKSGlTSKtggzEshuRbubmqr4h4x0VCto4ojQq-5r3E', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-13 12:30:22.279', '2026-08-06 12:30:22.282'),
('b491dfb8-37c8-4b8a-bb67-808fab4f3211', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzI1OCwiZXhwIjoxNzg2NDQyMDU4fQ.AW4qllk5cPYSwBkto8UkgUa7hln_3J1iEyqRzpm-nww', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 09:54:18.367', '2026-08-04 09:54:18.368'),
('b9e3ab3b-dac9-4193-89f1-ca9d2122b324', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTkyNzY4NywiZXhwIjoxNzg2NTMyNDg3fQ.LYJkza5r3JwhlrxVD3gJhHM5ROVZ4WvzrkXaxrqmZ-4', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-12 11:01:27.034', '2026-08-05 11:01:27.037'),
('ba0b92b6-4c5d-4870-b7fb-c5d94f3ff6ba', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1NDI1OSwiZXhwIjoxNzg2MzU5MDU5fQ.VvhQwWqiIn-7511JvA-DvhGIzEvisjrDSdWzQnwpEVY', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 10:50:59.663', '2026-08-03 10:50:59.671'),
('bbae83ee-ba58-4d12-9b10-3b7925a251a8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTgzNDIwLCJleHAiOjE3ODY1ODgyMjB9.G6KngH8oKvKEErEzfF9-ErvI0pWy97XVx9DoapMdDe4', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 02:30:20.321', '2026-08-06 02:30:20.322'),
('bcf203b3-fc98-4716-a9a2-ec03e44f87d1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTczNzUxOSwiZXhwIjoxNzg2MzQyMzE5fQ.YOW8E69ykZQYppSmN1wXmhrzEs4xjbj-OeWX12kuB9Q', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 06:11:59.064', '2026-08-03 06:11:59.066'),
('be1dacda-5761-4461-9533-d397e8066543', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgyMjg4OSwiZXhwIjoxNzg2NDI3Njg5fQ.p8bAWCtUQXHbLch8qwzAPhSnq4hrSPisrbAQcaoHXQk', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 05:54:49.531', '2026-08-04 05:54:49.533'),
('c21f5125-2fb0-4c56-907b-d45b66806751', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzg1NiwiZXhwIjoxNzg2NDQyNjU2fQ.6VTPCkXEL4ea7LZEV7TJfZ_25QXqxtgxQPrTchf7biQ', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 10:04:16.655', '2026-08-04 10:04:16.658'),
('c2fb8e35-7770-41ed-86aa-6e14fb0ce2e2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc4ODM4NCwiZXhwIjoxNzg2MzkzMTg0fQ.Y0QctPjM31zxQ7OR5ny4HdXp_4ZrJSlMpHVxnR7KThE', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 20:19:44.111', '2026-08-03 20:19:44.113'),
('c729c7aa-1470-452d-ac0d-9bf1d2925e50', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc1NzAyOSwiZXhwIjoxNzg2MzYxODI5fQ.HaUNDYLdFSXmL4tu-RtJe3gV_4kHyEQrpoj5CHkBl1o', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 11:37:09.185', '2026-08-03 11:37:09.187'),
('c7dc5be9-90de-40ae-a831-54b0d305bd49', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NjAwMDMxNCwiZXhwIjoxNzg2NjA1MTE0fQ.OtURyp9Qm3V7lsU8sDoSN1RSHdUxM6fZM4KU3-H0q2Q', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-13 07:11:54.658', '2026-08-06 07:11:54.666'),
('ca219cb6-0b53-4eb0-9537-0a67fc84b9aa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzE2NywiZXhwIjoxNzg2NDQxOTY3fQ.48UqjLHgEqKVfEI6t9BuxR8is6gZgs0OS5vwJKonIa8', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 09:52:47.257', '2026-08-04 09:52:47.259'),
('d86eec7f-ea9c-4f81-bd90-3c5b7d8587f4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzMyOSwiZXhwIjoxNzg2NDQyMTI5fQ.NioxVw7uEEQDXD2UJ_7oJ-BIcWK66jF6xGM5hhqSKJo', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 09:55:29.897', '2026-08-04 09:55:29.899'),
('d9fce8eb-4bf3-49a8-9635-ffbbad76f0ea', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYWFkMTY5Yy1hN2Y0LTQzNWYtYTEwMC1hZjM0NzAxMjY4ZmYiLCJlbWFpbCI6ImFkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzg1OTgzNzk1LCJleHAiOjE3ODY1ODg1OTV9.KugZGdXvOJ7miFm7KLEJ_E9bQlc9qbt1TnWiaSJwFXo', '0aad169c-a7f4-435f-a100-af34701268ff', '2026-08-13 02:36:35.533', '2026-08-06 02:36:35.537'),
('e4f9a4f9-9d7d-49ab-8f98-bbd0d923fcbb', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTkxMjU2NSwiZXhwIjoxNzg2NTE3MzY1fQ.YMu_lHIxX52NB7fL7X8f-66Pl_i87ZrhYNM3HlBs0mo', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-12 06:49:25.508', '2026-08-05 06:49:25.510'),
('eeaa7c7e-afce-4bdd-8fe1-0611505954b8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc0ODA1MSwiZXhwIjoxNzg2MzUyODUxfQ.2wfVNp5gkYvcTQxAPBO55tHI3csd9mstnrvOt4xr8BY', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 09:07:31.495', '2026-08-03 09:07:31.496'),
('ef84cfd3-9e22-4e84-a1d7-5e713723fa33', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTc5NDU4MCwiZXhwIjoxNzg2Mzk5MzgwfQ.6oCDiclWfjVe6_YodjZs7eiPS2vCtJlwKPuA6LrQxm4', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-10 22:03:00.904', '2026-08-03 22:03:00.906'),
('f3426708-eaa2-41dc-9ed3-208ab8c6e666', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTg0MTA1MCwiZXhwIjoxNzg2NDQ1ODUwfQ.sFK5djJ-dCXQw2H0PVwCjpoOlft6jtTfqjeuU7quQrY', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 10:57:30.060', '2026-08-04 10:57:30.063'),
('f6734bcf-f993-42ba-ae61-8a925084ac80', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MGYwZTU3OC00YmQ0LTQ0MTUtOTE5MC03NjFkNDY4ZjQ0ZTUiLCJlbWFpbCI6InJvaGl0QGdtYWlsLmNvbSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJpYXQiOjE3ODYwMjM5NjAsImV4cCI6MTc4NjYyODc2MH0.uwglgYqnUnTgsPsm4-mlW-pHs4YNfsI8YxLGbDdAlR8', '90f0e578-4bd4-4415-9190-761d468f44e5', '2026-08-13 13:46:00.167', '2026-08-06 13:46:00.170'),
('ff105047-7b10-43ce-85fd-b7c0677ffe97', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDhjZGI0Yy0zOGZiLTQxOWMtODNiNS0yMTcxNThiYzY2YjEiLCJlbWFpbCI6ImNsaW5pY2FkbWluQHpoZWFsdGguY29tIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImlhdCI6MTc4NTgzNzQxNiwiZXhwIjoxNzg2NDQyMjE2fQ.N-rzkJq4JWbnFip9maXTKYUWaxk3bJpK6wA44lE7gFA', 'b08cdb4c-38fb-419c-83b5-217158bc66b1', '2026-08-11 09:56:56.530', '2026-08-04 09:56:56.531');

-- --------------------------------------------------------

--
-- Table structure for table `sales_calendar_events`
--

CREATE TABLE `sales_calendar_events` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `time` varchar(191) NOT NULL,
  `clinic` varchar(191) NOT NULL,
  `contact` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Demo',
  `stage` varchar(191) DEFAULT 'Demo Scheduled',
  `notes` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Scheduled',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_calendar_events`
--

INSERT INTO `sales_calendar_events` (`id`, `displayId`, `title`, `date`, `time`, `clinic`, `contact`, `type`, `stage`, `notes`, `status`, `createdAt`, `updatedAt`) VALUES
('1a0e7ac8-ba2f-497e-9876-013bb538ff00', 'EVT-000001', 'Follow-ups: Nishant Solanki', '2026-08-03', '10:02', 'Nishant Solanki', 'rtyu', 'Follow-ups', 'Demo Scheduled', NULL, 'Scheduled', '2026-08-04 06:15:07.216', '2026-08-04 06:15:07.216'),
('b259f0e7-6e9e-47f9-971d-0e7d7f29e75f', 'EVT-000003', 'Demos: Nishant Solanki', '2026-08-13', '00:01', 'Nishant Solanki', 'ererty', 'Demos', 'Demo Scheduled', NULL, 'Scheduled', '2026-08-04 08:44:33.937', '2026-08-04 08:44:33.937'),
('ef5681a4-343e-4e14-a5e5-c6cc0c314058', 'EVT-000002', 'Demos: fghjk', '2026-08-05', '00:02', 'fghjk', '7895', 'Demos', 'Demo Scheduled', NULL, 'Scheduled', '2026-08-04 06:19:57.548', '2026-08-04 06:19:57.548');

-- --------------------------------------------------------

--
-- Table structure for table `sales_leads`
--

CREATE TABLE `sales_leads` (
  `id` varchar(191) NOT NULL,
  `companyName` varchar(191) NOT NULL,
  `contactPerson` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'New',
  `value` double NOT NULL DEFAULT 0,
  `assignedTo` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `stage` varchar(191) DEFAULT 'Lead Registered',
  `territory` varchar(191) DEFAULT 'General Platform',
  `tier` varchar(191) DEFAULT 'Basic',
  `history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`history`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_leads`
--

INSERT INTO `sales_leads` (`id`, `companyName`, `contactPerson`, `email`, `phone`, `status`, `value`, `assignedTo`, `notes`, `createdAt`, `updatedAt`, `displayId`, `stage`, `territory`, `tier`, `history`) VALUES
('01862b9e-d914-43c3-98fa-0eb5370201ff', 'tyui', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '6266301555q', 'New Lead', 10, 'AlluarjunSuperadmin', NULL, '2026-08-04 05:25:23.120', '2026-08-04 05:25:23.120', 'LED-000019', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('02bb1d85-1406-40ce-b278-e4f067068dcc', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '6266301555q', 'New Lead', 10, 'AlluarjunSuperadmin', NULL, '2026-08-04 04:08:06.970', '2026-08-04 04:08:06.970', 'LED-000013', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('1d955b21-0b9f-4521-a42e-c562bd4ab8fd', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '81200793123', 'Demo Scheduled', 0, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 05:29:12.694', '2026-08-04 08:44:33.937', 'LED-000020', 'Demo Scheduled', 'Khargone (West Nimar)', 'Basic', '[{\"time\":\"8/4/2026, 11:45:07 AM\",\"text\":\"Booked a Follow-ups on 2026-08-03 at 10:02\"},{\"time\":\"8/4/2026, 2:14:33 PM\",\"text\":\"Booked demo/meeting: Demos\"}]'),
('287247f6-1557-4f6d-bcde-42842b3bb1bc', 'babuji', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '1852', 'New Lead', 8, 'Michael Scott (Sales Exec)', 'tyuio', '2026-08-04 04:59:38.523', '2026-08-04 04:59:38.523', 'LED-000016', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('2dd0b841-6c11-43fc-87a8-d51f66f2ed9d', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '6266301555', 'New Lead', 135, 'AlluarjunSuperadmin', 'hjk', '2026-08-04 03:39:44.003', '2026-08-04 08:46:08.650', 'LED-000004', 'New Lead', 'Khargone (West Nimar)', 'Basic', '[{\"time\":\"8/4/2026, 2:16:08 PM\",\"text\":\"Sent pricing proposal: $135.00/mo (3 practitioners, AI note add-on: YES)\"}]'),
('38f1d253-5e59-4fd2-8516-958d95f3393c', 'Nishant Solanki788778', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '78', 'New Lead', 109, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:59:23.925', '2026-08-04 03:59:23.925', 'LED-000010', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('3ba6f9f9-cbda-4fbb-ab19-8d475da08c63', 'lakhan leader', 'lakhan Solanki', 'lakahan7@gmail.com', '9752100980', 'New Lead', 2, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:28:31.988', '2026-08-04 03:28:31.988', 'LED-000002', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('42318f80-5949-4e7f-a829-a633bae2f15e', 'k', 'k', 'nisha@gmail.com', 'k', 'New Lead', 8, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:31:45.964', '2026-08-04 03:31:45.964', 'LED-000003', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('49311b1b-957f-44b7-979a-ad39c2312c85', 'Nishant Solanki9999999999', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '3456789', 'New Lead', 2, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:57:23.421', '2026-08-04 03:57:23.421', 'LED-000008', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('4d7c4090-a9c2-4971-9663-2076f771d68a', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '3456789', 'New Lead', 0, 'AlluarjunSuperadmin', NULL, '2026-08-04 05:18:29.946', '2026-08-04 05:18:29.946', 'LED-000018', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('5f7ee730-e84a-4d03-8032-1f7dc2828878', 'werth', 'ewrt', 'j@gmail.com', '789456', 'New Lead', 12, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 04:09:21.673', '2026-08-04 04:09:21.673', 'LED-000014', 'New Lead', 'erth', 'Basic', NULL),
('66c44cf2-f545-4ae4-af4a-bcb034de7604', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '3456789', 'New Lead', 11, 'AlluarjunSuperadmin', NULL, '2026-08-04 04:02:38.823', '2026-08-04 04:02:38.823', 'LED-000011', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('7f157fc5-c767-410a-8daa-86dd9ba2b787', 'Nishant Solanki66666666666', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '6266301555', 'New Lead', 3, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:40:34.263', '2026-08-04 03:40:34.263', 'LED-000006', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('870b8823-ed9f-4882-9d09-b43092da8930', 'rtyui', 'fghj', 'vbnm@gmail.com', 'fghjk', 'New Lead', 10, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 05:38:07.415', '2026-08-04 05:38:07.415', 'LED-000023', 'New Lead', 'vghj', 'Basic', NULL),
('8d64b954-2061-4145-939f-bcf55b59b867', 'k', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '3456789', 'New Lead', 1, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:58:04.763', '2026-08-04 03:58:04.763', 'LED-000009', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('8ee3eee8-f967-489e-a540-6e308ac81ea8', 'rohit bhai ka ', 'ump', 'monkey@gmail.com', '78456', 'New Lead', 10, 'AlluarjunSuperadmin', NULL, '2026-08-04 08:56:37.322', '2026-08-04 08:56:37.322', 'LED-000026', 'New Lead', 'tyuio', 'Basic', NULL),
('90db0888-580b-41e8-9c63-9ac252e68c25', 'Nishant Solanki555555555', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '6266301555', 'Converted', 14, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:40:14.975', '2026-08-04 08:47:17.975', 'LED-000005', 'Converted', 'Khargone (West Nimar)', 'Basic', '[{\"time\":\"2026-08-04T08:47:17.974Z\",\"text\":\"Converted to Clinic successfully (Tier: Basic)\"}]'),
('91fe4028-0da9-44ce-af94-65441eb223c9', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '45454', 'New Lead', 455451, 'AlluarjunSuperadmin', NULL, '2026-08-04 04:05:16.647', '2026-08-04 04:05:16.647', 'LED-000012', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('93f6ae4e-6009-4102-9e01-d35c740497d4', 'Nishant Solanki', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '78865', 'New Lead', 10, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 04:11:20.951', '2026-08-04 04:11:20.951', 'LED-000015', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('c5f87d21-2043-4925-b78f-ea6e882113ae', 'hour', 'ghjk', 'fghj@gmailc.com', '88545', 'New Lead', 12, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 05:56:35.661', '2026-08-04 05:56:35.661', 'LED-000025', 'New Lead', 'gtyuil', 'Basic', NULL),
('caf8f32d-6ca5-4c15-89b9-045b3f7c55c2', 'drty', 'fghj', 'nisant@gmail.com', '6266301555', 'New Lead', 1, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 05:50:01.718', '2026-08-04 05:50:01.718', 'LED-000024', 'New Lead', 'g', 'Basic', NULL),
('cc537e20-ec64-4d4b-91a1-ec0fbf581b5a', 'rtyu', 'rtyui', 'nishantsolanki3107@gmail.com', '6266301555q', 'New Lead', 9, 'Michael Scott (Sales Exec)', NULL, '2026-08-04 05:33:25.658', '2026-08-04 05:33:25.658', 'LED-000021', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL),
('cc776034-724f-4b76-99b4-237594fa2ee6', 'ertyu', 'ertyui', 'ertyu@gmail.com', '7954563', 'New Lead', 10, 'AlluarjunSuperadmin', NULL, '2026-08-04 05:16:26.167', '2026-08-04 05:16:26.167', 'LED-000017', 'New Lead', 'rtyu', 'Basic', NULL),
('d88badf7-e1dc-4cb6-ad16-058a3797690a', 'fghjk', 'ghjk', 'g@gmail.com', '784', 'Demo Scheduled', 12, 'AlluarjunSuperadmin', NULL, '2026-08-04 05:34:29.772', '2026-08-04 06:19:57.568', 'LED-000022', 'Demo Scheduled', 'h', 'Basic', '[{\"time\":\"8/4/2026, 11:49:57 AM\",\"text\":\"Booked a Demos on 2026-08-05 at 00:02\"}]'),
('dacfc847-dcf2-45c6-b93e-8f4b934b2a45', 'YASHWANTROW', 'k', 'nishants@gmail.com', NULL, 'New', 2, 'Unassigned', NULL, '2026-08-01 07:57:15.602', '2026-08-01 07:57:15.602', 'LED-000001', 'New Lead', 'General Platform', 'Basic', NULL),
('db96dc1c-3cec-4d97-a81c-e6035f02f9cd', 'Nishant Solanki8888888', 'Nishant Solanki', 'nishantsolanki3107@gmail.com', '6266301555q', 'New Lead', 0, 'AlluarjunSuperadmin', NULL, '2026-08-04 03:56:59.496', '2026-08-04 03:56:59.496', 'LED-000007', 'New Lead', 'Khargone (West Nimar)', 'Basic', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales_messages`
--

CREATE TABLE `sales_messages` (
  `id` varchar(191) NOT NULL,
  `sender` varchar(191) NOT NULL,
  `recipient` varchar(191) NOT NULL DEFAULT 'Sales Team',
  `text` text NOT NULL,
  `timestamp` varchar(191) DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_tasks`
--

CREATE TABLE `sales_tasks` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `leadName` varchar(191) DEFAULT NULL,
  `dueDate` varchar(191) DEFAULT NULL,
  `priority` varchar(191) NOT NULL DEFAULT 'Medium',
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `assignedTo` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `category` varchar(191) DEFAULT 'Calls'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_tasks`
--

INSERT INTO `sales_tasks` (`id`, `displayId`, `title`, `leadName`, `dueDate`, `priority`, `status`, `assignedTo`, `notes`, `createdAt`, `updatedAt`, `category`) VALUES
('369afbeb-7f68-443d-a932-de4f130d18a2', 'TSK-000002', 'cvbn', 'fghjk', '26 Aug 2026', 'Medium', 'Completed', 'AlluarjunSuperadmin', NULL, '2026-08-04 06:46:48.776', '2026-08-04 06:47:07.410', 'Calls'),
('732fc47d-1fb0-4989-a89e-99d9362cc66f', 'TSK-000004', 'fghjk', 'tyui', '12 Aug 2026', 'Low', 'Pending', 'AlluarjunSuperadmin', NULL, '2026-08-04 07:02:09.913', '2026-08-04 07:02:09.913', 'Follow-ups'),
('95ff5444-7fe3-42e8-bed2-7832ea781fcb', 'TSK-000005', 'fghj', 'rtyu', '19 Aug 2026', 'High', 'Pending', 'AlluarjunSuperadmin', NULL, '2026-08-04 07:02:30.744', '2026-08-04 07:02:30.744', 'Follow-ups'),
('ed736477-bd0e-4efb-95c8-c5ce82a2bc1b', 'TSK-000003', 'ghjk', 'rtyui', '31 Aug 2026', 'Medium', 'Pending', 'AlluarjunSuperadmin', NULL, '2026-08-04 06:48:14.749', '2026-08-04 06:48:14.749', 'Calls'),
('f908cdfc-0fcd-4213-ac85-597c9e1b5092', 'TSK-000006', 'rtyu', 'tyui', '25 Aug 2026', 'High', 'Pending', 'AlluarjunSuperadmin', NULL, '2026-08-04 08:45:19.265', '2026-08-04 08:45:19.265', 'Follow-ups'),
('fb639d6c-a4f0-462b-a4c5-a1a893de43a0', 'TSK-000001', 'tues', 'Nishant Solanki', '31 Aug 2026', 'Low', 'Completed', 'AlluarjunSuperadmin', NULL, '2026-08-04 06:45:36.451', '2026-08-04 06:45:46.797', 'Calls');

-- --------------------------------------------------------

--
-- Table structure for table `sales_users`
--

CREATE TABLE `sales_users` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `territory` varchar(191) DEFAULT 'General Platform',
  `tier` varchar(191) DEFAULT 'Senior Regional Tier',
  `commissionRate` double NOT NULL DEFAULT 10,
  `commission` varchar(191) DEFAULT '10% recurring',
  `clinicsCount` int(11) NOT NULL DEFAULT 0,
  `pipelineCount` int(11) NOT NULL DEFAULT 0,
  `lastActivity` varchar(191) DEFAULT 'Recently',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `avatar` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_users`
--

INSERT INTO `sales_users` (`id`, `displayId`, `name`, `email`, `phone`, `territory`, `tier`, `commissionRate`, `commission`, `clinicsCount`, `pipelineCount`, `lastActivity`, `status`, `avatar`, `createdAt`, `updatedAt`) VALUES
('900bae8f-e01b-4b69-a7f0-1de0c4b86c61', 'SLS-000002', 'jainsirji', 'jain@gmail.com', '7895456', 'inidre', 'Gold', 10, '10% recurring', 0, 0, 'Just now', 'Active', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', '2026-08-06 02:42:55.897', '2026-08-06 02:43:07.907'),
('b1f096a7-e2ea-4fd3-8725-e0684552ba9f', 'SLS-000001', 'vijay bhai', 'nishantsolanki@gmail.com', '62660-49517', 'inodre', 'Silver', 10, '10% recurring', 0, 0, 'Just now', 'Active', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', '2026-07-31 12:35:14.040', '2026-07-31 12:35:14.040');

-- --------------------------------------------------------

--
-- Table structure for table `service_items`
--

CREATE TABLE `service_items` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Therapeutic Supports',
  `code` varchar(191) DEFAULT NULL,
  `price` double NOT NULL DEFAULT 0,
  `duration` int(11) NOT NULL DEFAULT 30,
  `taxable` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `color` varchar(191) DEFAULT '#8C4BFF',
  `ndisCode` varchar(191) DEFAULT NULL,
  `clinicId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_items`
--

INSERT INTO `service_items` (`id`, `name`, `category`, `code`, `price`, `duration`, `taxable`, `description`, `createdAt`, `updatedAt`, `archived`, `color`, `ndisCode`, `clinicId`) VALUES
('518fd5d8-5444-4718-b413-3e38ac59157c', 'Physiotherapy', 'Therapeutic Supports', NULL, 150, 60, 0, '', '2026-08-02 21:52:28.439', '2026-08-06 09:41:17.768', 1, '#8C4BFF', '01_011_0107_1_3', '249e7f58-98f6-4aa5-9920-7db3dadc0e57'),
('d4c20823-997a-4f11-a6bb-b757e4f9740d', 'ocuploplasty', 'Therapeutic Supports', NULL, 200, 15, 1, '200 only fees', '2026-08-06 09:41:17.753', '2026-08-06 09:41:17.753', 0, '#F59E0B', '454566', '249e7f58-98f6-4aa5-9920-7db3dadc0e57');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` varchar(191) NOT NULL,
  `clinicId` varchar(191) DEFAULT NULL,
  `clinicName` varchar(191) NOT NULL,
  `plan` varchar(191) NOT NULL,
  `billingCycle` varchar(191) NOT NULL DEFAULT 'Monthly',
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `nextBillingDate` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `clinicId`, `clinicName`, `plan`, `billingCycle`, `amount`, `status`, `nextBillingDate`, `createdAt`, `updatedAt`, `displayId`) VALUES
('6d64b1d8-edde-4bf4-9f40-f838ac44ad6f', '9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4', 'REh-2', 'Pro Package Updated', 'Annual', 199, 'Active', '2027-08-05', '2026-08-05 19:53:37.330', '2026-08-06 02:36:35.565', 'SUB-000006'),
('9ed19338-df81-4c40-b406-a9a422352664', '9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4', 'REh-2', 'Enterprise', 'Annual', 1000, 'Active', '2027-08-05', '2026-08-05 20:04:56.270', '2026-08-05 20:04:56.270', 'SUB-000007'),
('a008d95c-03e9-40cd-802f-098b5e82fcfd', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'rohit eye hospital', 'Enterprise', 'Annual', 1000, 'Active', '2027-07-31', '2026-07-31 21:51:01.210', '2026-07-31 21:51:01.210', 'SUB-000003'),
('c60e3afa-ca13-4593-a122-ce3c442c49ed', 'a6239bcf-45ec-4e20-8eff-e14e1810053e', 'reh-222', 'Pro', 'Annual', 250, 'Active', '2027-07-31', '2026-07-31 22:26:11.101', '2026-07-31 22:26:11.101', 'SUB-000004'),
('d92288ff-e428-4f33-acdc-c755e610cd4d', '9e0cdd2d-fdf5-44c0-8edc-cf19b52817f4', 'REh-2', 'Basic', 'Annual', 100, 'Active', '2027-08-05', '2026-08-05 20:28:10.918', '2026-08-05 20:28:10.918', 'SUB-000009'),
('da46a7cc-d110-4f54-872e-1f543f8e3876', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'rohit eye hospital', 'Pro', 'Annual', 250, 'Active', '2027-07-31', '2026-07-31 21:42:40.691', '2026-07-31 21:42:40.691', 'SUB-000001'),
('db268d31-70bc-4b31-99b7-98784342664f', NULL, 'chini', 'chini', 'Monthly', 151, 'Active', NULL, '2026-08-05 06:30:48.746', '2026-08-06 02:38:22.346', 'SUB-000005'),
('f608561c-5af7-4a2d-a784-6f12aec86c45', '249e7f58-98f6-4aa5-9920-7db3dadc0e57', 'rohit eye hospital', 'Basic', 'Annual', 100, 'Active', '2027-07-31', '2026-07-31 21:50:15.437', '2026-07-31 21:50:15.437', 'SUB-000002'),
('f97122d4-6bed-4e1c-a03a-0733d7e8adb7', 'd8cce2ae-745e-4d2a-ab39-834043e42ccd', 'REH-1', 'Pro', 'Annual', 250, 'Active', '2027-08-05', '2026-08-05 20:24:00.416', '2026-08-05 20:24:00.416', 'SUB-000008');

-- --------------------------------------------------------

--
-- Table structure for table `support_bugs`
--

CREATE TABLE `support_bugs` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Auth',
  `severity` varchar(191) NOT NULL DEFAULT 'High',
  `status` varchar(191) NOT NULL DEFAULT 'New',
  `clinic` varchar(191) NOT NULL DEFAULT 'System',
  `reporter` varchar(191) NOT NULL DEFAULT 'Support Agent',
  `date` varchar(191) DEFAULT NULL,
  `steps` text DEFAULT NULL,
  `affected` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_bugs`
--

INSERT INTO `support_bugs` (`id`, `displayId`, `title`, `category`, `severity`, `status`, `clinic`, `reporter`, `date`, `steps`, `affected`, `createdAt`, `updatedAt`) VALUES
('2f357c6b-2b8c-42dc-80e6-33d38cf7b5b5', 'BUG-000003', 'Clinical note autosave drops content on slow networks', 'Clinical Notes', 'High', 'New', 'Maplewood Dermatology', 'Dr. Emily Rodriguez', 'May 12, 2026', 'Type a long note on a throttled network → autosave silently fails', 4, '2026-07-31 12:00:20.636', '2026-07-31 12:00:20.636'),
('401138d5-24e2-48ea-b3db-94e71553962e', 'BUG-000006', 'Dashboard tooltip overlaps sidebar on 1280px width', 'Reports', 'Low', 'Won\'t Fix', 'Northside Dental', 'Dr. Amelia Park', 'Apr 30, 2026', 'View dashboard on exactly 1280x800 resolution', 1, '2026-07-31 12:00:20.636', '2026-07-31 12:00:20.636'),
('5506360e-4bba-40ab-a61f-3878b47d5d18', 'BUG-000004', 'Mobile app crashes on low-memory devices', 'Mobile', 'Medium', 'In Progress', 'Cedar Hill Clinic', 'Mobile crash logs', 'May 11, 2026', 'Open dashboard with > 50 patients on iPhone 11 or older → crash', 22, '2026-07-31 12:00:20.636', '2026-07-31 12:00:20.636'),
('5a1e2b21-8043-4024-a345-fe6c54b5ac15', 'BUG-000001', 'Add Staff form returns 500 on submit', 'Auth', 'Critical', 'In Progress', 'Westend Wellness', 'David Okonkwo', 'May 13, 2026', 'Open clinic settings → Staff → Add Staff → Fill all fields → Submit', 18, '2026-07-31 12:00:20.636', '2026-07-31 12:00:20.636'),
('b7194c17-c47d-492e-b407-51f79e1203f0', 'BUG-000005', 'Calendar timezone offset wrong for clinics in AUS', 'Scheduling', 'Medium', 'Fixed', 'Riverstone Cardiology', 'Support Team', 'May 08, 2026', 'Set clinic timezone to AEST → bookings display in UTC', 3, '2026-07-31 12:00:20.636', '2026-07-31 12:00:20.636'),
('e6df3ab8-0e28-4e7b-8890-01891d135d26', 'BUG-000002', 'Invoice PDF missing line items for annual plans', 'Billing', 'High', 'Triaged', 'Bayview Family Clinic', 'Sarah Chen', 'May 12, 2026', 'Open billing → annual invoice → Download PDF → line items missing', 9, '2026-07-31 12:00:20.636', '2026-07-31 12:00:20.636');

-- --------------------------------------------------------

--
-- Table structure for table `support_chat_messages`
--

CREATE TABLE `support_chat_messages` (
  `id` varchar(191) NOT NULL,
  `chatId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `clinic` varchar(191) NOT NULL,
  `sender` varchar(191) NOT NULL,
  `text` text NOT NULL,
  `time` varchar(191) DEFAULT NULL,
  `unread` int(11) NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_chat_messages`
--

INSERT INTO `support_chat_messages` (`id`, `chatId`, `name`, `clinic`, `sender`, `text`, `time`, `unread`, `status`, `createdAt`) VALUES
('01f9f94d-edd2-4fda-be9b-0fc7bacd55f7', 'undefined', 'Sarah Chen', 'Bayview Family Clinic', 'Support Agent', 'hi', 'Just now', 0, 'Active', '2026-07-31 12:01:42.645'),
('32d941d0-49d9-491f-8651-9ef3c2f27db6', '5', 'James Wilson', 'Greenfield Health', 'James Wilson', 'Following up on the refund timing.', '1h ago', 0, 'Active', '2026-07-31 12:00:20.636'),
('330c8928-a0d0-4bd1-b348-634147560916', 'undefined', 'Sarah Chen', 'Bayview Family Clinic', 'Support Agent', 'hiii', 'Just now', 0, 'Active', '2026-07-31 12:02:05.774'),
('5ab1088f-4d64-4d50-8dec-f1e62513773e', '3', 'David Okonkwo', 'Westend Wellness', 'David Okonkwo', 'I cannot add new staff — getting an error.', '5m ago', 1, 'Active', '2026-07-31 12:00:20.636'),
('e282be97-4cfa-41d3-8b43-c09161105f31', '4', 'Priya Patel', 'Sunrise Pediatrics', 'Priya Patel', 'Can someone walk me through the analytics tab?', '7m ago', 3, 'Waiting', '2026-07-31 12:00:20.636'),
('f68019e4-5ad7-4dc5-ab1f-56defe926052', 'undefined', 'Sarah Chen', 'Bayview Family Clinic', 'Support Agent', 'hiii', 'Just now', 0, 'Active', '2026-07-31 12:01:56.565'),
('f6adf535-0a3b-41cf-8942-e9f91b4bde80', '2', 'Dr. Amelia Park', 'Northside Dental', 'Dr. Amelia Park', 'Thanks, that worked! Closing this for now.', '10m ago', 0, 'Resolved', '2026-07-31 12:00:20.636'),
('f98799e8-bcd1-4ebf-a828-99d990621219', '1', 'Sarah Chen', 'Bayview Family Clinic', 'Sarah Chen', 'The invoice for May is still missing — can you check?', '28m ago', 2, 'Waiting', '2026-07-31 12:00:20.636');

-- --------------------------------------------------------

--
-- Table structure for table `support_clinic_history`
--

CREATE TABLE `support_clinic_history` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `clinic` varchar(191) NOT NULL,
  `ticketsResolved` int(11) NOT NULL DEFAULT 0,
  `bugsReported` int(11) NOT NULL DEFAULT 0,
  `lastContact` varchar(191) DEFAULT NULL,
  `satisfaction` varchar(191) NOT NULL DEFAULT '95%',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_clinic_history`
--

INSERT INTO `support_clinic_history` (`id`, `displayId`, `clinic`, `ticketsResolved`, `bugsReported`, `lastContact`, `satisfaction`, `createdAt`) VALUES
('1e6bf2ee-e925-4a57-abcf-956079987096', 'HST-000002', 'Smart Clinic', 8, 1, 'May 11, 2026', '100%', '2026-07-31 12:00:20.635'),
('d6c5d7b1-c3fe-4b2d-870e-0b7b43977479', 'HST-000005', 'Northside Care', 5, 2, 'May 10, 2026', '95%', '2026-07-31 12:00:20.635'),
('e0cca762-38b6-43d7-85e1-6f8209acb40e', 'HST-000004', 'Star Medical', 21, 5, 'May 13, 2026', '91%', '2026-07-31 12:00:20.635'),
('e8548c0c-53d4-4b99-a44b-b25e37008d06', 'HST-000001', 'Bayview Family Clinic', 14, 3, 'May 13, 2026', '94%', '2026-07-31 12:00:20.635'),
('ea5ec2dc-c83f-4df5-87cb-9411b534f353', 'HST-000003', 'Zoya Clinic', 12, 4, 'May 09, 2026', '88%', '2026-07-31 12:00:20.635');

-- --------------------------------------------------------

--
-- Table structure for table `support_features`
--

CREATE TABLE `support_features` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `desc` text NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'General',
  `status` varchar(191) NOT NULL DEFAULT 'Under Review',
  `clinic` varchar(191) NOT NULL DEFAULT 'System',
  `submitter` varchar(191) NOT NULL DEFAULT 'Support Agent',
  `date` varchar(191) DEFAULT NULL,
  `votes` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_features`
--

INSERT INTO `support_features` (`id`, `displayId`, `title`, `desc`, `category`, `status`, `clinic`, `submitter`, `date`, `votes`, `createdAt`, `updatedAt`) VALUES
('5a0393bb-daa0-4ab9-b544-d3a922d20079', 'FTR-000002', 'Bulk-export patient records by date range', 'Allow admins to export patient records as CSV or JSON filtered by a custom date range with HIPAA-safe redaction.', 'Reporting', 'Planned', 'Bayview Family Clinic', 'Sarah Chen', 'May 08, 2026', 84, '2026-07-31 12:00:20.635', '2026-07-31 12:00:20.635'),
('5ae218f6-a7a3-40a0-9fc9-f0d9daa00fcb', 'FTR-000004', 'Offline mode for mobile clinical notes', 'Allow editing notes offline and syncing once back online.', 'Mobile', 'Under Review', 'Westend Wellness', 'David Okonkwo', 'May 04, 2026', 47, '2026-07-31 12:00:20.635', '2026-07-31 12:00:20.635'),
('b5a12960-4c4d-4ab9-8212-a0e4e3417baf', 'FTR-000001', 'AI-generated SOAP note summaries', 'Use Zealth AI to summarize long clinical notes into a SOAP-format brief.', 'AI', 'In Progress', 'Maplewood Dermatology', 'Dr. Emily Rodriguez', 'Apr 22, 2026', 121, '2026-07-31 12:00:20.635', '2026-07-31 12:00:20.635'),
('b9f88383-c4e4-4f0f-9985-6db7270a3af6', 'FTR-000003', 'Two-way Google Calendar sync for clinicians', 'Sync appointment changes both directions, including reschedules and cancellations.', 'Integrations', 'Under Review', 'Northside Dental', 'Dr. Amelia Park', 'May 10, 2026', 62, '2026-07-31 12:00:20.635', '2026-07-31 12:00:20.635'),
('db22f9b9-80aa-4035-962f-3950632c1e89', 'FTR-000005', 'Stripe Tax automatic remittance', 'Automatically file taxes per region via Stripe Tax integration.', 'Billing', 'Shipped', 'Greenfield Health', 'James Wilson', 'Mar 18, 2026', 38, '2026-07-31 12:00:20.635', '2026-07-31 12:00:20.635'),
('ec0d3bcb-c97d-4441-b996-68d22f848b8e', 'FTR-000006', 'Custom branding on patient-facing emails', 'Let clinics upload a logo and brand color to email templates.', 'Workflow', 'Rejected', 'Cedar Hill Clinic', 'Owner', 'Apr 12, 2026', 19, '2026-07-31 12:00:20.635', '2026-07-31 12:00:20.635');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `desc` varchar(191) NOT NULL,
  `clinic` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Technical',
  `priority` varchar(191) NOT NULL DEFAULT 'Medium',
  `status` varchar(191) NOT NULL DEFAULT 'Open',
  `created` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `displayId`, `desc`, `clinic`, `email`, `category`, `priority`, `status`, `created`, `createdAt`, `updatedAt`) VALUES
('01a3d4f8-6249-4861-a27a-e602a8244ec3', 'TCK-000006', 'Patient portal login error', 'Star Medical', 'clinic2@health.test', 'Technical', 'High', 'Open', '6 Jun 2026', '2026-07-31 12:00:20.642', '2026-08-06 03:13:49.202'),
('0997c9c0-4921-4c34-87cb-57a39ecc77be', 'TCK-000001', 'Billing discrepancy on latest invoice', 'Smart Clinic', 'clinic0@health.test', 'Billing', 'Low', 'Open', '9 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('1508f124-1958-4a1f-a3bc-5631d6db4f3d', 'TCK-000009', 'Request: bulk patient export', 'Wellness Hub', 'clinic4@health.test', 'Feature Request', 'High', 'In progress', '7 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('1740165f-e8bd-4d78-b444-4fb5ce9416b9', 'TCK-000008', 'Patient portal login error', 'Wellness Hub', 'clinic4@health.test', 'Technical', 'Low', 'Open', '9 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('2ebda57b-c5cf-43fd-b696-b86ff7169269', 'TCK-000002', 'Cannot add new staff member', 'Zoya Clinic', 'clinic1@health.test', 'Account', 'Medium', 'In progress', '9 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('73afd8ff-5a45-4692-9268-c4053472169f', 'TCK-000003', 'AI summary not generating', 'Zoya Clinic', 'clinic1@health.test', 'Technical', 'Urgent', 'Resolved', '7 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('7f5db14d-f4c4-498d-b53a-7ff8646dc3b0', 'TCK-000007', 'White-label logo upload issue', 'Northside Care', 'clinic3@health.test', 'Technical', 'Urgent', 'Closed', '9 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('83cc9a6d-feb6-42f4-8c60-97bfcb361018', 'TCK-000005', 'White-label logo upload issue', 'Star Medical', 'clinic2@health.test', 'Technical', 'Low', 'Closed', '7 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('858e7cff-30ac-45ef-a29f-4c73f7b3ed4e', 'TCK-000004', 'AI summary not generating', 'Star Medical', 'clinic2@health.test', 'Technical', 'High', 'Resolved', '9 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642'),
('d209b3f7-3485-47f2-8b9a-5b307e3d689f', 'TCK-000010', 'Request: bulk patient export', 'Metro Health Center', 'clinic5@health.test', 'Feature Request', 'Medium', 'In progress', '9 Jun 2026', '2026-07-31 12:00:20.642', '2026-07-31 12:00:20.642');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
('5799cd21-4de7-47a6-97fd-ddef47922c9c', 'security_controls', '{\"enforceMfa\":true,\"encryptRest\":true,\"autoLogout\":false}', '2026-08-06 03:09:38.979', '2026-08-06 03:12:12.187'),
('5f14cced-2999-4231-b20d-3256cba4a274', 'payment_terms', '[{\"id\":\"pt1\",\"name\":\"7 Days\",\"days\":7,\"isDefault\":true},{\"id\":\"pt2\",\"name\":\"14 Days\",\"days\":14,\"isDefault\":false},{\"id\":\"pt3\",\"name\":\"30 Days\",\"days\":30,\"isDefault\":false},{\"id\":\"pt4\",\"name\":\"Due on Receipt\",\"days\":0,\"isDefault\":false}]', '2026-08-06 07:25:16.169', '2026-08-06 07:25:16.169');

-- --------------------------------------------------------

--
-- Table structure for table `treatment_plans`
--

CREATE TABLE `treatment_plans` (
  `id` varchar(191) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `patientId` varchar(191) DEFAULT NULL,
  `condition` varchar(191) NOT NULL,
  `practitioner` varchar(191) NOT NULL,
  `stage` varchar(191) NOT NULL,
  `overallProgress` int(11) NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `goals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`goals`)),
  `timeline` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`timeline`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `treatment_plans`
--

INSERT INTO `treatment_plans` (`id`, `displayId`, `patientId`, `condition`, `practitioner`, `stage`, `overallProgress`, `status`, `goals`, `timeline`, `createdAt`, `updatedAt`) VALUES
('4830d933-6b94-44eb-a9ae-6cb53617b88e', 'TP-000001_a9f30f', 'a9f30fe1-c334-4ce0-a3f9-90d157236fde', 'Chronic Lumbar Spinal Strain & Discogenic Lower Back Pain', 'Dr. Sarah Jenkins (Physiotherapist)', 'Phase 2: Lumbar Mobilisation & Spinal Stabilization', 65, 'Active', '[{\"id\":\"g1\",\"title\":\"Walk Pain Free (distance > 2km)\",\"percent\":70,\"status\":\"Active\"},{\"id\":\"g2\",\"title\":\"Return To Work (lift limits up to 15kg)\",\"percent\":50,\"status\":\"Active\"},{\"id\":\"g3\",\"title\":\"Improve Core Stability (plank hold > 60s)\",\"percent\":80,\"status\":\"Active\"}]', '[{\"id\":\"t1\",\"label\":\"Initial Assessment & Intake\",\"date\":\"02 Jan 2026\",\"desc\":\"Baseline lumbar ROM mapped. NDIS funding plan registered.\",\"status\":\"Completed\"},{\"id\":\"t2\",\"label\":\"Phase 1: Acute Relief & Stretching\",\"date\":\"25 Feb 2026\",\"desc\":\"Lumbar stretching extensions. Focus on reducing acute nerve inflammation.\",\"status\":\"Completed\"},{\"id\":\"t3\",\"label\":\"Progress Review & Exercise Routine update\",\"date\":\"18 May 2026\",\"desc\":\"Marked calf raises and ankle eccentric stretching adjustments.\",\"status\":\"Completed\"},{\"id\":\"t4\",\"label\":\"Phase 2: Stabilization & Core Loading\",\"date\":\"Current Phase\",\"desc\":\"Cat-Cow mobility, dead bug holds, and spinal loading drills.\",\"status\":\"Active\"},{\"id\":\"t5\",\"label\":\"Milestone: Functional Capacity Evaluation\",\"date\":\"Expected: 22 Jul 2026\",\"desc\":\"Comprehensive NDIS goal compliance checks and clinical reporting.\",\"status\":\"Pending\"},{\"id\":\"t6\",\"label\":\"Discharge Target\",\"date\":\"Expected: 30 Aug 2026\",\"desc\":\"Self-management care transition program.\",\"status\":\"Pending\"}]', '2026-08-05 10:45:11.906', '2026-08-05 10:45:11.906'),
('622ac1c8-6701-4380-80fe-cfb46b27cac4', 'TP-000001', '663001d8-6632-4470-a897-5d60467cb613', 'Chronic Lumbar Spinal Strain & Discogenic Lower Back Pain', 'Dr. Sarah Jenkins (Physiotherapist)', 'Phase 2: Lumbar Mobilisation & Spinal Stabilization', 65, 'Active', '[{\"id\":\"g1\",\"title\":\"Walk Pain Free (distance > 2km)\",\"percent\":70,\"status\":\"Active\"},{\"id\":\"g2\",\"title\":\"Return To Work (lift limits up to 15kg)\",\"percent\":50,\"status\":\"Active\"},{\"id\":\"g3\",\"title\":\"Improve Core Stability (plank hold > 60s)\",\"percent\":80,\"status\":\"Active\"}]', '[{\"id\":\"t1\",\"label\":\"Initial Assessment & Intake\",\"date\":\"02 Jan 2026\",\"desc\":\"Baseline lumbar ROM mapped. NDIS funding plan registered.\",\"status\":\"Completed\"},{\"id\":\"t2\",\"label\":\"Phase 1: Acute Relief & Stretching\",\"date\":\"25 Feb 2026\",\"desc\":\"Lumbar stretching extensions. Focus on reducing acute nerve inflammation.\",\"status\":\"Completed\"},{\"id\":\"t3\",\"label\":\"Progress Review & Exercise Routine update\",\"date\":\"18 May 2026\",\"desc\":\"Marked calf raises and ankle eccentric stretching adjustments.\",\"status\":\"Completed\"},{\"id\":\"t4\",\"label\":\"Phase 2: Stabilization & Core Loading\",\"date\":\"Current Phase\",\"desc\":\"Cat-Cow mobility, dead bug holds, and spinal loading drills.\",\"status\":\"Active\"},{\"id\":\"t5\",\"label\":\"Milestone: Functional Capacity Evaluation\",\"date\":\"Expected: 22 Jul 2026\",\"desc\":\"Comprehensive NDIS goal compliance checks and clinical reporting.\",\"status\":\"Pending\"},{\"id\":\"t6\",\"label\":\"Discharge Target\",\"date\":\"Expected: 30 Aug 2026\",\"desc\":\"Self-management care transition program.\",\"status\":\"Pending\"}]', '2026-08-05 09:59:03.573', '2026-08-05 09:59:03.573'),
('7b39123e-1c68-465e-9a1c-15afcf3bf4ca', 'TP-000001_e3d2a3', 'e3d2a328-df04-43cc-88e0-14352727c5c4', 'Chronic Lumbar Spinal Strain & Discogenic Lower Back Pain', 'Dr. Sarah Jenkins (Physiotherapist)', 'Phase 2: Lumbar Mobilisation & Spinal Stabilization', 65, 'Active', '[{\"id\":\"g1\",\"title\":\"Walk Pain Free (distance > 2km)\",\"percent\":70,\"status\":\"Active\"},{\"id\":\"g2\",\"title\":\"Return To Work (lift limits up to 15kg)\",\"percent\":50,\"status\":\"Active\"},{\"id\":\"g3\",\"title\":\"Improve Core Stability (plank hold > 60s)\",\"percent\":80,\"status\":\"Active\"}]', '[{\"id\":\"t1\",\"label\":\"Initial Assessment & Intake\",\"date\":\"02 Jan 2026\",\"desc\":\"Baseline lumbar ROM mapped. NDIS funding plan registered.\",\"status\":\"Completed\"},{\"id\":\"t2\",\"label\":\"Phase 1: Acute Relief & Stretching\",\"date\":\"25 Feb 2026\",\"desc\":\"Lumbar stretching extensions. Focus on reducing acute nerve inflammation.\",\"status\":\"Completed\"},{\"id\":\"t3\",\"label\":\"Progress Review & Exercise Routine update\",\"date\":\"18 May 2026\",\"desc\":\"Marked calf raises and ankle eccentric stretching adjustments.\",\"status\":\"Completed\"},{\"id\":\"t4\",\"label\":\"Phase 2: Stabilization & Core Loading\",\"date\":\"Current Phase\",\"desc\":\"Cat-Cow mobility, dead bug holds, and spinal loading drills.\",\"status\":\"Active\"},{\"id\":\"t5\",\"label\":\"Milestone: Functional Capacity Evaluation\",\"date\":\"Expected: 22 Jul 2026\",\"desc\":\"Comprehensive NDIS goal compliance checks and clinical reporting.\",\"status\":\"Pending\"},{\"id\":\"t6\",\"label\":\"Discharge Target\",\"date\":\"Expected: 30 Aug 2026\",\"desc\":\"Self-management care transition program.\",\"status\":\"Pending\"}]', '2026-08-06 10:48:40.401', '2026-08-06 10:48:40.401');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','CLINIC_ADMIN','PRACTITIONER','SALES_EXECUTIVE','PATIENT') NOT NULL DEFAULT 'CLINIC_ADMIN',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `displayId` varchar(191) DEFAULT NULL,
  `avatarUrl` text DEFAULT NULL,
  `profileData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`profileData`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `passwordHash`, `name`, `phone`, `role`, `status`, `createdAt`, `updatedAt`, `displayId`, `avatarUrl`, `profileData`) VALUES
('0aad169c-a7f4-435f-a100-af34701268ff', 'admin@zhealth.com', '$2a$10$6lBuLhDduEImu2FxD8Iz2uiqMY5Ssqj8DtZvc3C87vLJwbmYIaJfm', 'Alex Sadman (Super Admin)', '+61 400 000 001', 'SUPER_ADMIN', 'ACTIVE', '2026-08-06 02:29:36.799', '2026-08-06 06:43:21.670', 'ADM-000001', '', '{\"invoiceTemplates\":{\"logoUrl\":null,\"paymentTerms\":\"7 Days\",\"footerText\":\"Thank you for choosing ZealthOS practice network.\"},\"signature\":\"Colin Edegbe\",\"providerNumbers\":[{\"id\":1,\"type\":\"AHPRA\",\"num\":\"PHY000278016\",\"loc\":\"NDIS\"},{\"id\":2,\"type\":\"AHPRA\",\"num\":\"PHY000278016\",\"loc\":\"CEO Therapy Mobile\"},{\"id\":3,\"type\":\"Medicare\",\"num\":\"6683896B\",\"loc\":\"CEO Therapy Mobile\"}],\"services\":[],\"integrations\":{}}'),
('121b918f-2b3b-44c6-aad8-488d0f98dd40', 'minakshi@gmail.com', '$2a$10$hC4wm5HuHby1oq/5pcbV4O8UlXkbDRWz8AiKRqq0xxcKvWUDC5Qx.', 'Minakshimaam', '78965456', 'SUPER_ADMIN', 'ACTIVE', '2026-08-05 21:09:39.515', '2026-08-05 22:13:53.382', 'ADM-000003', NULL, '{\"roleTitle\":\"Manager\",\"permissions\":{\"Dashboard\":true,\"User Management\":true,\"Clinic Management\":true,\"Subscription Manage\":false,\"Subscription Invoice\":false,\"Sales & Affiliates\":false,\"AI Management\":false,\"Compliance & Audit\":false,\"Support Centre\":false,\"Reports & Analytics\":true,\"Settings\":false}}'),
('1dfafbeb-90a0-4396-9f57-6cfe1dd292a2', 'ftyu@gmail.com', '$2a$10$F4u2nemSaqi3ApcjwbjgO.lF2tQ3Cj9v46mXoduRvhEqQd4TQHj1S', 'Emma Watson', NULL, 'PATIENT', 'ACTIVE', '2026-08-06 10:44:28.414', '2026-08-06 10:44:28.414', NULL, NULL, NULL),
('39845aac-e968-4e4f-a711-b634106379d6', 'patient@zhealth.com', '$2a$10$X..38CMZEnh539TWWChjrOi7eqQxsZ6VOR2zvFaagRVLAoDF8EIZ6', 'John Doe', NULL, 'PATIENT', 'ACTIVE', '2026-08-06 10:44:28.666', '2026-08-06 10:44:28.666', NULL, NULL, NULL),
('7a99f812-9b54-462a-b4c4-184bb655ba07', 'sumanjain@gmail.com', '$2a$10$uqovbqwDEAXjuQhNcdFi1eiRslEWtDI2LUiftTCdT.H/H/hT.dOmi', 'suman jain', NULL, 'PATIENT', 'ACTIVE', '2026-08-06 10:44:35.666', '2026-08-06 10:44:35.666', NULL, NULL, NULL),
('82fe6dc8-dd95-4a0d-bf60-2683556f4cdb', 'superadmin@gmail.com', '$2a$10$vyjgeG6o0g.dJydUyTLLke0oOO3QorM6nC0aLnjpcmyu1Fz100T96', 'Dr. Colin Edegbe111111111', NULL, 'PATIENT', 'ACTIVE', '2026-08-06 10:44:28.549', '2026-08-06 10:44:28.549', NULL, NULL, NULL),
('90f0e578-4bd4-4415-9190-761d468f44e5', 'rohit@gmail.com', '$2a$10$MxqslE7g9R6D7rlpi/qWeumq5y0X8IWEC55eZjqxD4j0GI3jr5PUi', 'dr.OP Agrawallllllllll', '8120073190', 'CLINIC_ADMIN', 'ACTIVE', '2026-08-05 19:09:14.071', '2026-08-06 13:29:39.803', 'ADM-000009', NULL, '{\"dob\":\"1985-06-15\",\"gender\":\"Female\",\"street\":\"123 Health Ave\",\"city\":\"Medical District\",\"state\":\"NSW\",\"country\":\"Australia\",\"postalCode\":\"2000\"}'),
('b08cdb4c-38fb-419c-83b5-217158bc66b1', 'clinicadmin@zhealth.com', '$2a$10$3v.Gp75FE4/ESvsoBV0JqOYTLI/J5YATOMtAEDd2wBgniK8zoz/p2', 'Zoya Rahman (Clinic Admin)', '+61 400 000 002', 'CLINIC_ADMIN', 'ACTIVE', '2026-08-03 06:08:42.628', '2026-08-03 06:08:42.628', 'ADM-000002', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_branches`
--

CREATE TABLE `user_branches` (
  `userId` varchar(191) NOT NULL,
  `branchId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_branches`
--

INSERT INTO `user_branches` (`userId`, `branchId`) VALUES
('90f0e578-4bd4-4415-9190-761d468f44e5', '6c6bd23f-e402-4b1a-81b5-6a8d681018ee');

-- --------------------------------------------------------

--
-- Table structure for table `waitlists`
--

CREATE TABLE `waitlists` (
  `id` varchar(191) NOT NULL,
  `clientName` varchar(191) NOT NULL,
  `dob` varchar(191) DEFAULT NULL,
  `contactNumber` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `preferredPractitioner` varchar(191) DEFAULT NULL,
  `preferredDate` varchar(191) DEFAULT NULL,
  `dateAdded` varchar(191) DEFAULT NULL,
  `appointmentType` varchar(191) DEFAULT 'Initial Assessment',
  `status` varchar(191) NOT NULL DEFAULT 'Waiting',
  `branch` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `waitlists`
--

INSERT INTO `waitlists` (`id`, `clientName`, `dob`, `contactNumber`, `address`, `preferredPractitioner`, `preferredDate`, `dateAdded`, `appointmentType`, `status`, `branch`, `createdAt`) VALUES
('1ab4525f-64cf-42c5-b339-7af6f5938d64', 'rahul patidar', '2026-08-13', '7895', 'fc', 'dr.srejal', NULL, '2026-08-06', 'Follow-Up', 'Waiting', 'reh-1', '2026-08-06 11:05:11.543'),
('88683f84-9437-4777-9f2b-ddb81173a7eb', 'fghjdk', '2026-08-26', '6266049517', '45 Health Avenue', 'Any Practitioner', '2026-08-26', '2026-08-03', 'Initial Assessment', 'Cancelled', 'Nishant Solanki', '2026-08-03 08:58:47.102'),
('e5cb9d75-6f34-4fc8-bb4a-dd93efce9adb', 'Alice Smith', NULL, '+61 411 222 333', NULL, 'Dr. Sarah Jenkins', NULL, NULL, 'Initial Assessment', 'Contacted', NULL, '2026-07-31 09:33:53.434'),
('fdbf8a0d-952f-4d4b-be80-5446d3652302', 'Alice Smith', NULL, '+61 411 222 333', NULL, 'Dr. Sarah Jenkins', NULL, NULL, 'Initial Assessment', 'Cancelled', NULL, '2026-07-31 06:39:21.601');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affiliates`
--
ALTER TABLE `affiliates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `affiliates_displayId_key` (`displayId`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointments_displayId_key` (`displayId`),
  ADD KEY `appointments_patientId_fkey` (`patientId`),
  ADD KEY `appointments_practitionerId_fkey` (`practitionerId`),
  ADD KEY `appointments_branchId_fkey` (`branchId`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `audit_logs_displayId_key` (`displayId`),
  ADD KEY `audit_logs_userId_fkey` (`userId`);

--
-- Indexes for table `body_chart_templates`
--
ALTER TABLE `body_chart_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branches_clinicId_fkey` (`clinicId`);

--
-- Indexes for table `cancellation_reasons`
--
ALTER TABLE `cancellation_reasons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client_tags`
--
ALTER TABLE `client_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clinics`
--
ALTER TABLE `clinics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clinics_displayId_key` (`displayId`);

--
-- Indexes for table `compliance_alerts`
--
ALTER TABLE `compliance_alerts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `compliance_alerts_displayId_key` (`displayId`);

--
-- Indexes for table `consultation_notes`
--
ALTER TABLE `consultation_notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `consultation_notes_displayId_key` (`displayId`),
  ADD KEY `consultation_notes_patientId_date_idx` (`patientId`,`date`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contacts_displayId_key` (`displayId`);

--
-- Indexes for table `data_management_logs`
--
ALTER TABLE `data_management_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `data_management_logs_displayId_key` (`displayId`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `form_templates`
--
ALTER TABLE `form_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `governance_logs`
--
ALTER TABLE `governance_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `governance_logs_displayId_key` (`displayId`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_displayId_key` (`displayId`),
  ADD KEY `invoices_patientId_fkey` (`patientId`);

--
-- Indexes for table `letter_templates`
--
ALTER TABLE `letter_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `note_templates`
--
ALTER TABLE `note_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patients_userId_key` (`userId`),
  ADD UNIQUE KEY `patients_displayId_key` (`displayId`);

--
-- Indexes for table `patient_claims`
--
ALTER TABLE `patient_claims`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patient_claims_displayId_key` (`displayId`),
  ADD KEY `patient_claims_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `patient_forms`
--
ALTER TABLE `patient_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_forms_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `patient_funding_accounts`
--
ALTER TABLE `patient_funding_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_funding_accounts_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `patient_health_shares`
--
ALTER TABLE `patient_health_shares`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_health_shares_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `patient_invoices`
--
ALTER TABLE `patient_invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patient_invoices_displayId_key` (`displayId`),
  ADD KEY `patient_invoices_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `patient_outcome_measures`
--
ALTER TABLE `patient_outcome_measures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_outcome_measures_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `patient_progress_trends`
--
ALTER TABLE `patient_progress_trends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_progress_trends_patientId_createdAt_idx` (`patientId`,`createdAt`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_receiptNumber_key` (`receiptNumber`);

--
-- Indexes for table `practitioners`
--
ALTER TABLE `practitioners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `practitioners_email_key` (`email`),
  ADD UNIQUE KEY `practitioners_userId_key` (`userId`);

--
-- Indexes for table `prescribed_exercises`
--
ALTER TABLE `prescribed_exercises`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_displayId_key` (`displayId`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refresh_tokens_token_key` (`token`),
  ADD KEY `refresh_tokens_userId_fkey` (`userId`);

--
-- Indexes for table `sales_calendar_events`
--
ALTER TABLE `sales_calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_calendar_events_displayId_key` (`displayId`);

--
-- Indexes for table `sales_leads`
--
ALTER TABLE `sales_leads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_leads_displayId_key` (`displayId`);

--
-- Indexes for table `sales_messages`
--
ALTER TABLE `sales_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_tasks`
--
ALTER TABLE `sales_tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_tasks_displayId_key` (`displayId`);

--
-- Indexes for table `sales_users`
--
ALTER TABLE `sales_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_users_email_key` (`email`),
  ADD UNIQUE KEY `sales_users_displayId_key` (`displayId`);

--
-- Indexes for table `service_items`
--
ALTER TABLE `service_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscriptions_displayId_key` (`displayId`),
  ADD KEY `subscriptions_clinicId_fkey` (`clinicId`);

--
-- Indexes for table `support_bugs`
--
ALTER TABLE `support_bugs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_bugs_displayId_key` (`displayId`);

--
-- Indexes for table `support_chat_messages`
--
ALTER TABLE `support_chat_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_clinic_history`
--
ALTER TABLE `support_clinic_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_clinic_history_displayId_key` (`displayId`);

--
-- Indexes for table `support_features`
--
ALTER TABLE `support_features`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_features_displayId_key` (`displayId`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_tickets_displayId_key` (`displayId`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `system_settings_key_key` (`key`);

--
-- Indexes for table `treatment_plans`
--
ALTER TABLE `treatment_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `treatment_plans_displayId_key` (`displayId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_displayId_key` (`displayId`);

--
-- Indexes for table `user_branches`
--
ALTER TABLE `user_branches`
  ADD PRIMARY KEY (`userId`,`branchId`),
  ADD KEY `user_branches_branchId_fkey` (`branchId`);

--
-- Indexes for table `waitlists`
--
ALTER TABLE `waitlists`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_practitionerId_fkey` FOREIGN KEY (`practitionerId`) REFERENCES `practitioners` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `branches_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `clinics` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `patient_claims`
--
ALTER TABLE `patient_claims`
  ADD CONSTRAINT `patient_claims_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_forms`
--
ALTER TABLE `patient_forms`
  ADD CONSTRAINT `patient_forms_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_funding_accounts`
--
ALTER TABLE `patient_funding_accounts`
  ADD CONSTRAINT `patient_funding_accounts_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_health_shares`
--
ALTER TABLE `patient_health_shares`
  ADD CONSTRAINT `patient_health_shares_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_invoices`
--
ALTER TABLE `patient_invoices`
  ADD CONSTRAINT `patient_invoices_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_outcome_measures`
--
ALTER TABLE `patient_outcome_measures`
  ADD CONSTRAINT `patient_outcome_measures_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patient_progress_trends`
--
ALTER TABLE `patient_progress_trends`
  ADD CONSTRAINT `patient_progress_trends_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `practitioners`
--
ALTER TABLE `practitioners`
  ADD CONSTRAINT `practitioners_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `clinics` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_branches`
--
ALTER TABLE `user_branches`
  ADD CONSTRAINT `user_branches_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_branches_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
