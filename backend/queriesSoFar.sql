--What is the cumulative number of incidents over time for different times of day?
WITH LateNightIncidents AS (
    SELECT *
    FROM Incidents
    WHERE TimeOcc < 600 AND TimeOcc <> 1
),
MorningIncidents AS (
    SELECT *
    FROM Incidents
    WHERE TimeOcc >= 600 AND TimeOcc < 1200
),
AfternoonIncidents AS (
    SELECT *
    FROM Incidents
    WHERE TimeOcc >= 1200 AND TimeOcc < 1800
),
NightIncidents AS (
    SELECT *
    FROM Incidents
    WHERE TimeOcc >= 1800 AND TimeOcc < 2400
),
LNICumu AS (
    SELECT TO_CHAR(lni.DateOcc, 'YYYY-MM') AS Month,
    SUM(COUNT(lni.DrNo)) OVER (ORDER BY TO_DATE(TO_CHAR(lni.DateOcc, 'YYYY-MM'), 'YYYY-MM')) AS CumulativeLateNightIncidents
    FROM LateNightIncidents lni
    GROUP BY TO_CHAR(lni.DateOcc, 'YYYY-MM')
    ORDER BY TO_CHAR(lni.DateOcc, 'YYYY-MM')
),
MICumu AS (
    SELECT TO_CHAR(mi.DateOcc, 'YYYY-MM') AS Month,
    SUM(COUNT(mi.DrNo)) OVER (ORDER BY TO_DATE(TO_CHAR(mi.DateOcc, 'YYYY-MM'), 'YYYY-MM')) AS CumulativeMorningIncidents
    FROM MorningIncidents mi
    GROUP BY TO_CHAR(mi.DateOcc, 'YYYY-MM')
    ORDER BY TO_CHAR(mi.DateOcc, 'YYYY-MM')
),
AICumu AS (
    SELECT TO_CHAR(ai.DateOcc, 'YYYY-MM') AS Month,
    SUM(COUNT(ai.DrNo)) OVER (ORDER BY TO_DATE(TO_CHAR(ai.DateOcc, 'YYYY-MM'), 'YYYY-MM')) AS CumulativeAfternoonIncidents
    FROM AfternoonIncidents ai
    GROUP BY TO_CHAR(ai.DateOcc, 'YYYY-MM')
    ORDER BY TO_CHAR(ai.DateOcc, 'YYYY-MM')
),
NICumu AS (
    SELECT TO_CHAR(ni.DateOcc, 'YYYY-MM') AS Month,
    SUM(COUNT(ni.DrNo)) OVER (ORDER BY TO_DATE(TO_CHAR(ni.DateOcc, 'YYYY-MM'), 'YYYY-MM')) AS CumulativeNightIncidents
    FROM NightIncidents ni
    GROUP BY TO_CHAR(ni.DateOcc, 'YYYY-MM')
    ORDER BY TO_CHAR(ni.DateOcc, 'YYYY-MM')
)
SELECT lnic.Month, lnic.CumulativeLateNightIncidents, mic.CumulativeMorningIncidents, aic.CumulativeAfterNoonIncidents, nic.CumulativeNightIncidents
FROM LNICumu lnic, MICumu mic, AICumu aic, NICumu nic
WHERE lnic.Month = mic.Month AND mic.Month = aic.Month AND aic.Month = nic.Month;


--What was the rate of incidents that happened in a residency where minors were the victim over time?
WITH IncidentsAgainstMinors AS (
    SELECT *
    FROM Incidents i, Victims v
    WHERE i.VictimCode = v.VictimCode
    AND v.VictimAge < 18 AND v.VictimAge > 0
),
HomePremises AS (
    SELECT PremisesCode FROM Premises
    WHERE PremisesCode > 499 AND PremisesCode < 600
),
LSVRM AS (
    SELECT TO_CHAR(DateOcc, 'YYYY-MM') AS Month,
    ROUND(AVG(CASE WHEN PremisesCode IN (SELECT * FROM HomePremises) THEN 1 ELSE 0 END),4) AS MinorHomeVictimization
    FROM IncidentsAgainstMinors
    GROUP BY TO_CHAR(DateOcc, 'YYYY-MM')
),
LSVRA AS (
    SELECT TO_CHAR(DateOcc, 'YYYY-MM') AS Month,
    ROUND(AVG(CASE WHEN PremisesCode IN (SELECT * FROM HomePremises) THEN 1 ELSE 0 END),4) AS AllHomeVictimization
    FROM Incidents
    GROUP BY TO_CHAR(DateOcc, 'YYYY-MM')
)
    SELECT lm.*, la.AllHomeVictimization
    FROM LSVRM lm, LSVRA la
    WHERE lm.Month = la.Month
    ORDER BY lm.Month ASC;

--What is the arrest rate over time for juveniles as an identified incident perpetrator vs. adults?
WITH JuvenileArrestRate AS (
    SELECT TO_CHAR(DateOcc, 'YYYY') AS Year,
    ROUND(COUNT(CASE WHEN StatusDesc IN ('Juv Arrest') THEN 1 END) / COUNT(CASE WHEN StatusDesc IN ('Juv Arrest', 'Juv Other') THEN 1 END),4) AS JuvenileArrestRate
    FROM Incidents
    GROUP BY TO_CHAR(DateOcc, 'YYYY')
    ORDER BY TO_CHAR(DateOcc, 'YYYY')
),
AdultArrestRate AS (
    SELECT TO_CHAR(DateOcc, 'YYYY') AS Year,
    ROUND(COUNT(CASE WHEN StatusDesc IN ('Adult Arrest') THEN 1 END) / COUNT(CASE WHEN StatusDesc IN ('Adult Arrest', 'Adult Other') THEN 1 END),4) AS AdultArrestRate
    FROM Incidents
    GROUP BY TO_CHAR(DateOcc, 'YYYY')
    ORDER BY TO_CHAR(DateOcc, 'YYYY')
)
SELECT jar.Year, jar.JuvenileArrestRate, aar.AdultArrestRate
FROM JuvenileArrestRate jar, AdultArrestRate aar
WHERE jar.Year = aar.Year;

--Find all the instances of the top three crimes committed against the largest group of victims by heritage and provide a description, crime code, and location of the crime
WITH Greatest_Victims (VictimDescent, VictimCount) as 
    (SELECT VictimDescent, count(*) as VictimCount
    FROM Victims
    GROUP BY VictimDescent
    ORDER BY VictimDescent ASC ),
    
TopCrimesAgainstLargestVictimDescent AS(
SELECT CrimeCode
FROM IncidentCrimes
WHERE DRNO IN (
        SELECT DRNO
        FROM Incidents
        WHERE VictimCode IN (
            SELECT VictimCode
            FROM Victims
            WHERE VictimDescent =(
                SELECT VictimDescent
                FROM Greatest_Victims
                WHERE VictimCount =(
                    SELECT MAX(VictimCount)
                    FROM Greatest_Victims
                    )
                )
            )
        )
     GROUP BY CrimeCode
ORDER BY COUNT(CrimeCode) DESC
FETCH FIRST 3 ROWS ONLY), 

RecordsOFTopCrimes AS (
SELECT DRNO, CrimeCode 
FROM IncidentCrimes
WHERE CrimeCode IN (SELECT CrimeCode FROM TopCrimesAgainstLargestVictimDescent)),

Loc AS ( 
SELECT LAT, LON
FROM Incidents 
WHERE  Incidents.DRNO IN (SELECT DRNO FROM RecordsOfTopCrimes)),

CrimeAreas AS (
SELECT AREA, Locations.LAT, Locations.LON
FROM Locations, Loc
WHERE Locations.LAT = Loc.LAT AND Locations.LON = Loc.LON), 

LinkedAreaIncidents AS (
SELECT DISTINCT AREA, DRNO
FROM Incidents
JOIN CrimeAreas ON Incidents.LAT = CrimeAreas.LAT AND Incidents.LON = CrimeAreas.LON
ORDER BY DRNO DESC), 

CodesForCrime AS (
SELECT AREA, CrimeCode, LinkedAreaIncidents.DRNO
FROM LinkedAreaIncidents, IncidentCrimes
WHERE LinkedAreaIncidents.DRNO = IncidentCrimes.DRNO),

UniqueCrimes AS(
SELECT Distinct DRNO, CrimeCode
FROM IncidentCrimes 
Where CrimeCode IN (SELECT CRIMECODE FROM TopCrimesAgainstLargestVictimDescent)),

TopCrimeLoc AS (
SELECT UniqueCrimes.CrimeCode,  Area
From CodesForCrime, UniqueCrimes
WHERE UniqueCrimes.DRNO = CodesForCrime.DRNO),

CrimeTop AS (
SELECT Crimes.CrimeCode, Crimes.CrimeDescription
FROM Crimes
JOIN TopCrimesAgainstLargestVictimDescent ON Crimes.CrimeCode = TopCrimesAgainstLargestVictimDescent.CrimeCode 
WHERE ROWNUM <= 3
GROUP BY Crimes.CrimeCode, Crimes.CrimeDescription )

Select*
FROM CrimeTop;

--List of all heritages and their victim count over 2020-2024
SELECT VictimDescent, count(*) as VictimCount
    FROM Victims
    GROUP BY VictimDescent
    ORDER BY VictimDescent ASC;

--List the heritage with the most victims over 2020-2024
WITH Greatest_Victims (VictimDescent, VictimCount) as 
    (SELECT VictimDescent, count(*) as VictimCount
    FROM Victims
    GROUP BY VictimDescent
    ORDER BY VictimDescent ASC )
    
        SELECT VictimDescent, VictimCount
        FROM Greatest_Victims
        WHERE VictimCount =(
                SELECT MAX(VictimCount)
                FROM Greatest_Victims
                );

--Q5 Find the change over time (2020-2024) of crime counts by crime
WITH 
Crimes_2020 AS (    
SELECT DRNO, DATEOCC
FROM Incidents
WHERE DATEOCC > to_date('01-JAN-20', 'DD-MON-YY') AND DATEOCC < to_date('31-DEC-20','DD-MON-YY')),

Crimes_2024 AS (    
SELECT DRNO, DATEOCC
FROM Incidents
WHERE DATEOCC >= to_date('01-JAN-24', 'DD-MON-YY') AND DATEOCC <= to_date('31-DEC-24','DD-MON-YY')), 

types_of_crimes20 AS (
SELECT ic.CrimeCode, COUNT(ic.CrimeCode) as Crime_Count
FROM IncidentCrimes ic
JOIN Crimes_2020 c20 ON ic.DRNO = c20.DRNO
GROUP BY ic.CrimeCode),

types_of_crimes24 AS (
SELECT ic.CrimeCode, COUNT(ic.CrimeCode) as Crime_Count
FROM IncidentCrimes ic
JOIN Crimes_2024 c24 ON ic.DRNO = c24.DRNO
GROUP BY ic.CrimeCode),

diff_crimes AS (
SELECT tc20.CrimeCode as CrimeCode, tc20.Crime_Count as Crime_2020, tc24.Crime_Count as Crime_2024, (tc24.Crime_Count - tc20.Crime_Count) as Crime_Change
FROM types_of_crimes20 tc20, types_of_crimes24 tc24
WHERE tc20.CrimeCode = tc24.CrimeCode
ORDER BY tc20.CrimeCode ASC), 

crime_change_desc AS (
SELECT c.CrimeCode, c.CrimeDescription, df.Crime_2020, df.Crime_2024,  df.Crime_Change
FROM diff_crimes df
JOIN Crimes c ON df.CrimeCode = c.CrimeCode)


SELECT *
FROM crime_change_desc;
