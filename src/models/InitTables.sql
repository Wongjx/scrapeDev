USE DurianDB;
DROP TABLE IF EXISTS DurianPrices;
DROP TABLE IF EXISTS FacebookPosts;
DROP TABLE IF EXISTS DurianTypes;
DROP TABLE IF EXISTS Vendors;
-- Create Tables and Triggers
Create TABLE `DurianTypes` (
    DurianTypeID VARCHAR(5) NOT NULL,
    Name VARCHAR(70) NOT NULL,
    SpeciesNumber SMALLINT,
    PRIMARY KEY (DurianTypeID)
);
CREATE TABLE `Vendors` (
    VendorID VARCHAR(36) NOT NULL,
    Name VARCHAR(70) NOT NULL,
    Site VARCHAR(50),
    PhoneNumber MEDIUMINT UNSIGNED,
    FacebookPageName VARCHAR(50),
    HasDevliery BOOLEAN NOT NULL DEFAULT False,
    DevlieryDetails VARCHAR(400),
    PRIMARY KEY ( VendorID )
);
CREATE TABLE `FacebookPosts` (
    VendorID VARCHAR(36) NOT NUll,
    PostDate INT UNSIGNED NOT NULL ,
    Contents VARCHAR(3000) NOT NULL,
    IsProcessed BOOLEAN NOT NULL DEFAULT False,
    PRIMARY KEY ( VendorID, PostDate ),
    FOREIGN KEY (VendorID)
        REFERENCES Vendors(VendorID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TABLE `DurianPrices` (
    VendorID VARCHAR(36) NOT NUll,
    PostDate INT UNSIGNED NOT NULL,
    DurianTypeID VARCHAR(5) NOT NUll,
    PricePerKilo TINYINT UNSIGNED  NOT NULL,
    SpecialDeal VARCHAR(400),

    PRIMARY KEY ( VendorID, PostDate, DurianTypeID),
    FOREIGN KEY (VendorID)
        REFERENCES Vendors(VendorID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DurianTypeID)
        REFERENCES DurianTypes(DurianTypeID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Insert Starting Values
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d1','Mao Shan Wang', 197);
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d2','Mao Shan Wang (Pahang)', 197);
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d3','Mao Shan Wang (Johor Bahru)', 197);
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d4','D1', 1);
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d5','D13', 13);
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d6','D101', 101);
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d7','Red Prawn', 175);
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d8','Golden Phoneix');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d9','Wang Zhong Wang');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d10','Black Gold');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d11','Black Pearl');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d12','XO');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d13','Green Bamboo');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d14','Hu Lu Wang');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d15','Kampung');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d16','Gang Hai');
INSERT INTO DurianTypes (DurianTypeID, Name,SpeciesNumber) VALUES('d17','S17', 17);
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d18','Tawa');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d19','Black Thorn');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d20','Mei Qiu');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d21','Kasap');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d22','Wang Zhong Wang (Pahang)');
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d23','Wang Zhong Wang (Johor Bahru)');
INSERT INTO DurianTypes (DurianTypeID, Name, SpeciesNumber) VALUES('d24','D24', 24);
INSERT INTO DurianTypes (DurianTypeID, Name) VALUES('d25','Butter');

-- INSERT INTO Vendors (Name,Site,PhoneNumber,FacebookPageName,HasDevliery,DevlieryDetails) VALUES('Leong Tee Durian',);
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Leong Tee Durian','leongteedurian');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'227 Katong Durian','227katongdurian');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'99 Old Trees','99oldtrees');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Ah Seng Durian','AhSengDurian');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'King Fruits Durian','kingfruitsg');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Combat Durian','Combat-Durian-Balestier-Singapore-159016387480898');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Durian Empire Pungol','durianempiresg');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Wang Sheng Li','wang.2818.com88');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),`Melvin's Durian`,'Melvinsdurian');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'The Durian Tree','theduriantree');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'96 Super Durian','96durian');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Durian Lingers','durianlingersJK');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Durian Kaki','DurianKakiSG');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'The Durian Story','thedurianstory');
INSERT INTO Vendors (VendorID,Name,FacebookPageName) VALUES(UUID(),'Bao Jiak Durian','Baojiakdurian');

-- INSERT INTO DurianPrices(VendorID,PostDate,DurianTypeID,PricePerKilo) VALUES('76aebda5-9eec-11e9-939d-b827eb9352db',1,'d1',1);
-- INSERT INTO DurianPrices(VendorID,PostDate,DurianTypeID,PricePerKilo) VALUES('76aebda5-9eec-11e9-939d-b827eb9352db',1,'d2',2);
-- INSERT INTO DurianPrices(VendorID,PostDate,DurianTypeID,PricePerKilo) VALUES('76aebda5-9eec-11e9-939d-b827eb9352db',2,'d1',3);
-- INSERT INTO DurianPrices(VendorID,PostDate,DurianTypeID,PricePerKilo) VALUES('76b9ee21-9eec-11e9-939d-b827eb9352db',1,'d1',5);
-- INSERT INTO DurianPrices(VendorID,PostDate,DurianTypeID,PricePerKilo) VALUES('76b9ee21-9eec-11e9-939d-b827eb9352db',3,'d1',9);
-- ALTER TABLE FacebookPosts ADD COLUMN IsProcessed BOOLEAN NOT NULL DEFAULT False;

SELECT a.*,c.FacebookPageName FROM DurianPrices a LEFT OUTER JOIN DurianPrices b ON a.VendorID = b.VendorID AND a.DurianTypeID = b.DurianTypeID AND a.PostDate < b.PostDate INNER JOIN Vendors c ON a.VendorID=c.VendorID WHERE b.VendorID IS NULL AND b.DurianTypeID IS NULL;