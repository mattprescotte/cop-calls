import cx_Oracle
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

user = 'YOURUSERNAME'
pw = 'YOURPASSWORD'
host = 'oracle.cise.ufl.edu'
port = '1521'
sid = 'orcl'

cx_Oracle.init_oracle_client(lib_dir=r"C:/oracle/instantclient_21_13")
dsn = cx_Oracle.makedsn(host, port, sid=sid)
connection = cx_Oracle.connect(user=user, password=pw, dsn=dsn)

@app.route('/')
def index():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Crimes")
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/home')
def topCrimes3():
    myQuery = """
    SELECT COUNT(*)
    FROM Incidents
    """
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/home-victims')
def homeVictims():
    # will take the parameters timeUnits, and a True/False for including an all-incidents line
    # time units are either Day, Month, or Year. This is our grouping of data
    # standard column is either True or False, determining if there will be a comparison to minor victimization with regular victimization
    try:
        timeUnits = request.args.get('timeUnits')
        standardColumn = request.args.get('standardColumn')
    except TypeError as e:
        print("hello")
        return jsonify({'error': 'All arguments required!'}), 400
    
    if (standardColumn == 'True'):
        standardColumn = True
    else:
        standardColumn = False
    myQuery = "WITH IncidentsAgainstMinors AS (SELECT * FROM Incidents i, Victims v WHERE i.VictimCode = v.VictimCode AND v.VictimAge < 18 AND v.VictimAge > 0), HomePremises AS (SELECT PremisesCode FROM Premises WHERE PremisesCode > 499 AND PremisesCode < 600), "
    if (timeUnits == "Month"):
        timeLine = 'YYYY-MM'
    elif (timeUnits == "Day"):
        timeLine = 'YYYY-MM-DD'
    elif (timeUnits == "Year"):
        timeLine = 'YYYY'
    myQuery += "LSVRM AS (SELECT TO_CHAR(DateOcc, '" + timeLine + "') AS " + timeUnits + ", ROUND(AVG(CASE WHEN PremisesCode IN (SELECT * FROM HomePremises) THEN 1 ELSE 0 END),4) AS MinorHomeVictimization FROM IncidentsAgainstMinors GROUP BY TO_CHAR(DateOcc, '" + timeLine + "')), "
    myQuery += "LSVRA AS (SELECT TO_CHAR(DateOcc, '" + timeLine + "') AS " + timeUnits + ", ROUND(AVG(CASE WHEN PremisesCode IN (SELECT * FROM HomePremises) THEN 1 ELSE 0 END),4) AS AllHomeVictimization FROM Incidents GROUP BY TO_CHAR(DateOcc, '" + timeLine + "')) "

    if (standardColumn):
        myQuery += "SELECT lm.*, la.AllHomeVictimization FROM LSVRM lm, LSVRA la WHERE lm." + timeUnits + " = la." + timeUnits + " ORDER BY lm." + timeUnits + " ASC"
    else: 
        myQuery += "SELECT lm.* FROM LSVRM lm ORDER BY lm." + timeUnits + " ASC"
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/top-crimes')
def topCrimes():
    myQuery = """
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
    SELECT TopCrimeLoc.CrimeCode, Crimes.CrimeDescription, TopCrimeLoc.Area
    FROM Crimes, TopCrimeLoc
    Where Crimes.CrimeCode = TopCrimeLoc.CrimeCode )

    Select*
    FROM CrimeTop
    """
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/top-crimes2')
def topCrimes2():
    myQuery = """
    SELECT VictimDescent, count(*) as VictimCount
    FROM Victims
    GROUP BY VictimDescent
    ORDER BY VictimDescent ASC
    """
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/top-crimes3')
def topCrimes3():
    myQuery = """
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
                )
    """
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/time-of-day')
def timeOfDay():
    # will take the parameters earliestTime, latestTime, timeUnits
    timeUnits = request.args.get('timeUnits')
    # query sends back 5 columns of data: the time intervals + 4 categories of time-of-day. 
    # Each row is the cumulative incident number up until that point
    # Can emphasize general incidence rate and trends in when crimes are committed
    myQuery = """
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
    WHERE lnic.Month = mic.Month AND mic.Month = aic.Month AND aic.Month = nic.Month
    """
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

@app.route('/events')
def events():
    earliestTime = request.args.get('earliestTime')
    latestTime = request.args.get('latestTime')
    timeUnits = request.args.get('timeUnits')

@app.route('/arrest-proportions')
def arrestProportions():
    myQuery = """
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
    WHERE jar.Year = aar.Year
    """
    cursor = connection.cursor()
    cursor.execute(myQuery)
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
