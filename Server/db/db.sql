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
CREATE TABLE weather(
    weather_id BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
    source_id VARCHAR(10) NOT NULL,
    valid_from TIMESTAMP,
    element VARCHAR(50),
    CONSTRAINT fk_source
            FOREIGN KEY(source_id) 
            REFERENCES sources(id)
            ON DELETE CASCADE 
);

CREATE TABLE weather_data(
              weather_id INT, 
              element VARCHAR(50),
              time timestamp,
              value INT,
              CONSTRAINT fk_weather
            FOREIGN KEY(weather_id) 
            REFERENCES weather(weather_id)
            ON DELETE CASCADE );

CREATE TABLE elements(
    element_id BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
    element_name VARCHAR(50),
    unit VARCHAR(50)
);
INSERT INTO elements(element_name, unit) values('air_temperature','celicus');

CREATE TABLE inntekt_data(
   /* id INT PRIMARY KEY NOT NULL, */
   regionid INT NOT NULL,
   region VARCHAR(50) NOT NULL,
   husholdningstype VARCHAR(100),
   tid int,
   inntekt int,
   antallhus int
);
SELECT * FROM inntekt_data s INNER JOIN kommuner k on s.region = k.kommune_navn;
/* CREATE TABLE test_inntekt(
    region VARCHAR(100),
    husholdningstype VARCHAR(50),
    år INT,
    statistikkvariabel VARCHAR(100),
    inntekt VARCHAR(50)
);

UPDATE inntekt_data
SET husholdningstype = REPLACE(
    CAST(husholdningstype as VARCHAR(100)),'´┐¢', 'aa'
    )
WHERE husholdningstype LIKE '%´┐¢%';

UPDATE inntekt_data
SET region = REPLACE(
    CAST(region as VARCHAR(100)),'´┐¢', 'aa'
    )
WHERE region LIKE '%´┐¢%';

UPDATE inntekt_data
SET region = REPLACE(
    CAST(region as VARCHAR(100)),'´┐¢', 'oe'
    )
WHERE region LIKE '%´┐¢%'; */
