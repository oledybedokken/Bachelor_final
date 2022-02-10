CREATE DATABASE bachelor;

CREATE EXTENSION postgis;

CREATE TABLE sources(
    id VARCHAR(10) PRIMARY KEY UNIQUE NOT NULL,
    type VARCHAR(50),
    name VARCHAR(50) NOT NULL,
    shortName VARCHAR(50),
    country VARCHAR(50) NOT NULL,
    countryCode VARCHAR(50),
    long VARCHAR(50) NOT NULL,
    lat VARCHAR(50) NOT NULL,
    geog geography(point) NOT NULL,
    valid_from TIMESTAMP,
    county VARCHAR(50) NOT NULL,
    countyId INT NOT NULL,
    municipality VARCHAR(50) NOT NULL,
    municipalityId INT NOT NULL
);

CREATE TABLE inntekt(
   id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
   regionid INT NOT NULL,
   region VARCHAR(50) NOT NULL,
   statistikkvariabel VARCHAR(200),
   aar int,
   husrsaa int
);


