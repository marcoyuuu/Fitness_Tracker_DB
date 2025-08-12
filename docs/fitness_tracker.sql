-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2024 at 05:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fitness_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `comentario`
--

CREATE TABLE `comentario` (
  `ComentarioID` int(11) NOT NULL,
  `SesiónID` int(11) NOT NULL,
  `Texto` text NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comentario`
--

INSERT INTO `comentario` (`ComentarioID`, `SesiónID`, `Texto`, `Fecha`) VALUES
(1, 4, 'Great session, really felt the impact!', '2024-05-10'),
(2, 5, 'Challenging but rewarding session', '2024-05-11'),
(3, 6, 'Need to adjust the intensity next time', '2024-05-12');

-- --------------------------------------------------------

--
-- Table structure for table `ejercicio`
--

CREATE TABLE `ejercicio` (
  `EjercicioID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Descripción` text DEFAULT NULL,
  `Sets` int(11) DEFAULT NULL,
  `Repeticiones` int(11) DEFAULT NULL,
  `Peso` decimal(5,2) DEFAULT NULL,
  `Equipamiento` varchar(255) DEFAULT NULL,
  `Duración` time DEFAULT NULL,
  `Distancia` decimal(5,2) DEFAULT NULL,
  `TipoEstiramiento` varchar(255) DEFAULT NULL,
  `isEntrenamientoDeFuerza` tinyint(1) DEFAULT 0,
  `isCardio_Circuitos` tinyint(1) DEFAULT 0,
  `isCore_Estabilidad` tinyint(1) DEFAULT 0,
  `isPliométricos` tinyint(1) DEFAULT 0,
  `isFlexibilidad_Movilidad` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ejercicio`
--

INSERT INTO `ejercicio` (`EjercicioID`, `Nombre`, `Descripción`, `Sets`, `Repeticiones`, `Peso`, `Equipamiento`, `Duración`, `Distancia`, `TipoEstiramiento`, `isEntrenamientoDeFuerza`, `isCardio_Circuitos`, `isCore_Estabilidad`, `isPliométricos`, `isFlexibilidad_Movilidad`) VALUES
(4, 'Squat', 'A lower body exercise that primarily targets the quads, hamstrings, and glutes.', 4, 12, 100.00, 'Barbell', NULL, NULL, NULL, 1, 0, 0, 0, 0),
(5, 'Running', 'A cardiovascular exercise that primarily targets the lower body and improves endurance.', NULL, NULL, NULL, 'Running shoes', '00:30:00', 5.00, NULL, 0, 1, 0, 0, 0),
(6, 'Plank', 'A core exercise that involves maintaining a position similar to a push-up for the maximum possible time.', 3, NULL, NULL, 'None', '00:01:00', NULL, NULL, 0, 0, 1, 0, 0),
(7, 'Jump Rope', 'A full-body exercise that increases cardiovascular fitness and coordination.', 5, 50, NULL, 'Jump rope', '00:02:00', NULL, NULL, 0, 0, 0, 1, 0),
(8, 'Hamstring Stretch', 'A flexibility exercise to stretch the hamstrings.', NULL, NULL, NULL, 'None', '00:01:00', NULL, 'static', 0, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `meta`
--

CREATE TABLE `meta` (
  `MetaID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `FechaLímite` date NOT NULL,
  `Completado` tinyint(1) DEFAULT 0,
  `Descripción` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meta`
--

INSERT INTO `meta` (`MetaID`, `UserID`, `FechaLímite`, `Completado`, `Descripción`) VALUES
(1, 1, '2024-06-02', 0, 'Run a 5k'),
(2, 1, '2024-06-15', 0, 'Squat 315 lbs for 5 reps.'),
(3, 1, '2024-07-01', 1, 'Hold a plank for 3 minutes.'),
(4, 1, '2024-06-20', 0, 'Jump rope for 10 minutes without stopping.'),
(5, 1, '2024-06-30', 0, 'Improve hamstring flexibility and touch toes.'),
(6, 1, '2024-07-15', 0, 'Complete a 10k run.');

-- --------------------------------------------------------

--
-- Table structure for table `programa`
--

CREATE TABLE `programa` (
  `ProgramaID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Descripción` text DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programa`
--

INSERT INTO `programa` (`ProgramaID`, `Nombre`, `Descripción`, `FechaInicio`, `FechaFin`) VALUES
(1, 'Full Body Challenge', 'A comprehensive full body workout program.', '2024-05-01', '2024-06-01'),
(2, 'Cardio Blast', 'An intensive cardio program to boost endurance.', '2024-06-01', '2024-07-01'),
(3, 'Strength Training', 'A program focused on building muscle strength.', '2024-07-01', '2024-08-01');

-- --------------------------------------------------------

--
-- Table structure for table `programacontienerutina`
--

CREATE TABLE `programacontienerutina` (
  `ProgramaID` int(11) NOT NULL,
  `RutinaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programacontienerutina`
--

INSERT INTO `programacontienerutina` (`ProgramaID`, `RutinaID`) VALUES
(1, 6),
(1, 7),
(1, 8),
(2, 7),
(2, 8),
(3, 6),
(3, 8);

-- --------------------------------------------------------

--
-- Table structure for table `rutina`
--

CREATE TABLE `rutina` (
  `RutinaID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Descripción` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rutina`
--

INSERT INTO `rutina` (`RutinaID`, `Nombre`, `Descripción`) VALUES
(6, 'Full Body Workout', 'A comprehensive workout targeting major muscle groups and cardiovascular endurance.'),
(7, 'Cardio Blast', 'A high-intensity cardio routine to boost your heart rate and endurance.'),
(8, 'Flexibility and Core', 'A routine focused on improving flexibility and core strength.');

-- --------------------------------------------------------

--
-- Table structure for table `rutinacontieneejercicio`
--

CREATE TABLE `rutinacontieneejercicio` (
  `RutinaID` int(11) NOT NULL,
  `EjercicioID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rutinacontieneejercicio`
--

INSERT INTO `rutinacontieneejercicio` (`RutinaID`, `EjercicioID`) VALUES
(6, 4),
(6, 5),
(6, 6),
(7, 5),
(7, 7),
(8, 6),
(8, 8);

-- --------------------------------------------------------

--
-- Table structure for table `sesioncontienerutina`
--

CREATE TABLE `sesioncontienerutina` (
  `SesiónID` int(11) NOT NULL,
  `RutinaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sesioncontienerutina`
--

INSERT INTO `sesioncontienerutina` (`SesiónID`, `RutinaID`) VALUES
(4, 6),
(5, 7),
(6, 8);

-- --------------------------------------------------------

--
-- Table structure for table `sesión`
--

CREATE TABLE `sesión` (
  `SesiónID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Duración` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sesión`
--

INSERT INTO `sesión` (`SesiónID`, `UserID`, `Fecha`, `Duración`) VALUES
(4, 1, '2024-05-10', '01:30:00'),
(5, 2, '2024-05-11', '02:00:00'),
(6, 3, '2024-05-12', '00:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `UserID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`UserID`, `Nombre`, `Correo`, `Contraseña`) VALUES
(1, 'testuser', 'user@example.com', 'hashed_password'),
(2, 'John Doe', 'john.doe@example.com', 'password123'),
(3, 'Jane Smith', 'jane.smith@example.com', 'password456'),
(4, 'Alex Johnson', 'alex.johnson@example.com', 'password789');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`ComentarioID`),
  ADD KEY `SesiónID` (`SesiónID`);

--
-- Indexes for table `ejercicio`
--
ALTER TABLE `ejercicio`
  ADD PRIMARY KEY (`EjercicioID`);

--
-- Indexes for table `meta`
--
ALTER TABLE `meta`
  ADD PRIMARY KEY (`MetaID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `programa`
--
ALTER TABLE `programa`
  ADD PRIMARY KEY (`ProgramaID`);

--
-- Indexes for table `programacontienerutina`
--
ALTER TABLE `programacontienerutina`
  ADD PRIMARY KEY (`ProgramaID`,`RutinaID`),
  ADD KEY `RutinaID` (`RutinaID`);

--
-- Indexes for table `rutina`
--
ALTER TABLE `rutina`
  ADD PRIMARY KEY (`RutinaID`);

--
-- Indexes for table `rutinacontieneejercicio`
--
ALTER TABLE `rutinacontieneejercicio`
  ADD PRIMARY KEY (`RutinaID`,`EjercicioID`),
  ADD KEY `EjercicioID` (`EjercicioID`);

--
-- Indexes for table `sesioncontienerutina`
--
ALTER TABLE `sesioncontienerutina`
  ADD PRIMARY KEY (`SesiónID`,`RutinaID`),
  ADD KEY `RutinaID` (`RutinaID`);

--
-- Indexes for table `sesión`
--
ALTER TABLE `sesión`
  ADD PRIMARY KEY (`SesiónID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Correo` (`Correo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comentario`
--
ALTER TABLE `comentario`
  MODIFY `ComentarioID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ejercicio`
--
ALTER TABLE `ejercicio`
  MODIFY `EjercicioID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `meta`
--
ALTER TABLE `meta`
  MODIFY `MetaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `programa`
--
ALTER TABLE `programa`
  MODIFY `ProgramaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rutina`
--
ALTER TABLE `rutina`
  MODIFY `RutinaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `sesión`
--
ALTER TABLE `sesión`
  MODIFY `SesiónID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`SesiónID`) REFERENCES `sesión` (`SesiónID`);

--
-- Constraints for table `meta`
--
ALTER TABLE `meta`
  ADD CONSTRAINT `meta_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `usuario` (`UserID`);

--
-- Constraints for table `programacontienerutina`
--
ALTER TABLE `programacontienerutina`
  ADD CONSTRAINT `programacontienerutina_ibfk_1` FOREIGN KEY (`ProgramaID`) REFERENCES `programa` (`ProgramaID`),
  ADD CONSTRAINT `programacontienerutina_ibfk_2` FOREIGN KEY (`RutinaID`) REFERENCES `rutina` (`RutinaID`);

--
-- Constraints for table `rutinacontieneejercicio`
--
ALTER TABLE `rutinacontieneejercicio`
  ADD CONSTRAINT `rutinacontieneejercicio_ibfk_1` FOREIGN KEY (`RutinaID`) REFERENCES `rutina` (`RutinaID`),
  ADD CONSTRAINT `rutinacontieneejercicio_ibfk_2` FOREIGN KEY (`EjercicioID`) REFERENCES `ejercicio` (`EjercicioID`);

--
-- Constraints for table `sesioncontienerutina`
--
ALTER TABLE `sesioncontienerutina`
  ADD CONSTRAINT `sesioncontienerutina_ibfk_1` FOREIGN KEY (`SesiónID`) REFERENCES `sesión` (`SesiónID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sesioncontienerutina_ibfk_2` FOREIGN KEY (`RutinaID`) REFERENCES `rutina` (`RutinaID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sesión`
--
ALTER TABLE `sesión`
  ADD CONSTRAINT `sesión_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `usuario` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
