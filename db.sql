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

CREATE TABLE inntekt_data(
   /* id INT PRIMARY KEY NOT NULL, */
   regionid INT NOT NULL,
   region VARCHAR(50) NOT NULL,
   husholdningstype VARCHAR(100),
   tid int,
   inntekt int,
   antallhus int
);
CREATE TABLE weather_data(
    source_id VARCHAR(10) NOT NULL,
    time TIMESTAMP,
    average_temp INTEGER[],
    CONSTRAINT fk_source
            FOREIGN KEY(source_id) 
            REFERENCES sources(id)
            ON DELETE CASCADE 
);



