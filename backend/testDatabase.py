import cx_Oracle
from flask import Flask, request, jsonify

app = Flask(__name__)

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
    return str(result)

@app.route('/extreme-areas')
def extremeAreas():
    #check if there are all the arguments. Set non-provided ones to default

    #establish the timeline of events
    earliestTime = request.args.get('earliestTime')
    latestTime = request.args.get('latestTime')
    #is the graph in days, months, or years?
    timeUnits = request.args.get('timeUnits')

@app.route('/time-of-day')
def timeOfDay():
    # will take the parameters earliestTime, latestTime, timeUnits
    
    # query sends back 5 columns of data: the time intervals + 4 categories of time-of-day. 
    # Each row is the cumulative incident number up until that point
    # Can emphasize general incidence rate and trends in when crimes are committed
    return

@app.route('/home-victims')
def homeVictims():
    # will take the parameters earliestTime, latestTime, timeUnits, and a True/False for including an all-incidents line
    # earliest time should be before latest time, as they create the min and max limits of the timeline for our dataset.
    # time units are either Day, Month, or Year. This is our grouping of data
    # standard column is either True or False, determining if there will be a comparison to minor victimization with regular victimization
    try:
        earliestTime = request.args.get('earliestTime')
        latestTime = request.args.get('latestTime')
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
    print(myQuery)
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
    earliestTime = request.args.get('earliestTime')
    latestTime = request.args.get('latestTime')
    timeUnits = request.args.get('timeUnits')

if __name__ == '__main__':
    app.run(debug=True)