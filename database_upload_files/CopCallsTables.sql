CREATE TABLE Premises (
    PremisesCode INT,
    PremisesDescription VARCHAR2(70),
    PRIMARY KEY (PremisesCode)
);

CREATE TABLE Locations (
    Lat NUMERIC(8,4),
    Lon NUMERIC(8,4),
    Area VARCHAR2(15),
    RDNo INT,
    AddressLine VARCHAR2(50),
    PRIMARY KEY (Lat, Lon)
);

CREATE TABLE Victims (
    VictimCode INT NOT NULL,
    VictimAge INT,
    VictimSex VARCHAR2(1),
    VictimDescent VARCHAR2(1),
    PRIMARY KEY (VictimCode)
);

CREATE TABLE Incidents (
    DrNo INT NOT NULL,
    DateRptd DATE,
    DateOcc DATE,
    TimeOcc INT,
    StatusDesc VARCHAR2(15),
    Lat NUMERIC(8,4),
    Lon NUMERIC(8,4),
    VictimCode INT,
    PremisesCode INT,
    PRIMARY KEY (DrNo),
    FOREIGN KEY (Lat, Lon) REFERENCES Locations(Lat, Lon),
    FOREIGN KEY (VictimCode) REFERENCES Victims(VictimCode),
    FOREIGN KEY (PremisesCode) REFERENCES Premises(PremisesCode)
);

CREATE TABLE IncidentMOs (
    DrNo INT NOT NULL,
    MOCode INT NOT NULL,
    PRIMARY KEY (DrNo, MOCode),
    FOREIGN KEY (DrNo) REFERENCES Incidents(DrNo)
);

CREATE TABLE Crimes (
    CrimeCode INT NOT NULL,
    CrimeDescription VARCHAR2(60),
    PRIMARY KEY (CrimeCode)
);

CREATE TABLE IncidentCrimes (
    DrNo INT NOT NULL,
    CrimeCode INT NOT NULL,
    PRIMARY KEY (DrNo, CrimeCode),
    FOREIGN KEY (DrNo) REFERENCES Incidents(DrNo),
    FOREIGN KEY (CrimeCode) REFERENCES Crimes(CrimeCode)
);

CREATE TABLE Weapons (
    WeaponCode INT NOT NULL,
    WeaponDescription VARCHAR2(60),
    PRIMARY KEY (WeaponCode)
);

CREATE TABLE IncidentWeapons (
    DrNo INT NOT NULL,
    WeaponCode INT NOT NULL,
    PRIMARY KEY (DrNo, WeaponCode),
    FOREIGN KEY (DrNo) REFERENCES Incidents(DrNo),
    FOREIGN KEY (WeaponCode) REFERENCES Weapons(WeaponCode)
);
