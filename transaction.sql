-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 25, 2017 at 07:40 AM
-- Server version: 5.7.20-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cryptex`
--

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `from_symbol` varchar(255) NOT NULL,
  `to_symbol` varchar(255) NOT NULL,
  `exchange` varchar(255) NOT NULL,
  `last_trade_id` varchar(255) NOT NULL,
  `flag` int(11) NOT NULL,
  `price` varchar(255) NOT NULL,
  `last_volume` varchar(255) NOT NULL,
  `last_volume_to` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `from_symbol`, `to_symbol`, `exchange`, `last_trade_id`, `flag`, `price`, `last_volume`, `last_volume_to`, `created`) VALUES
(1, 'BTC', 'USD', 'Bitfinex', '141397212', 4, '13296', '0.1', '1329.6000000000001', '2017-12-25 02:10:39'),
(2, 'BTC', 'USD', 'Bitfinex', '141397232', 2, '13292', '0.002', '26.584', '2017-12-25 02:10:40'),
(3, 'BTC', 'USD', 'Bitfinex', '141397245', 2, '13291', '0.03', '398.72999999999996', '2017-12-25 02:10:41'),
(4, 'BTC', 'USD', 'Bitfinex', '141397266', 1, '13294', '0.03451', '458.77594', '2017-12-25 02:10:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `last_trade_id` (`last_trade_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
