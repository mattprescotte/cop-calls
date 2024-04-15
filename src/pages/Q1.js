//import React from 'react';
import React, { useState } from "react";
import {
    LineChart,
    ResponsiveContainer,
    Legend,
    Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import {render} from "@testing-library/react";
// Sample chart data
const pdata = [];
const data = [];
try {
    const response = await fetch('http://localhost:5000/time-of-day?timeUnits=Month'); 
    const jsonData = await response.json();
    for (let num = 0; num < jsonData.length; num++){
        pdata.push({
            date_: jsonData[num][0],
            Latenight_Incidents: jsonData[num][1],
            Morning_Incidents: jsonData[num][2],
            Afternoon_Incidents: jsonData[num][3],
            Night_Incidents: jsonData[num][4]
        })
    }

  } catch (error) {
    console.error('Unable to fetch data:', error);
  }
for (let num = 0; num < pdata.length; num++){
    data.push(pdata[num])
}
function Q1() {
    const [user, setuser] = useState("")
    const [pass, setpass] = useState("")
    const [status, setstatus] = useState("")
    const check_sub = () => {
        if (user.length != 7 || pass.length != 7){
            setstatus("Incorrect Input(s)")
        }
        else if (user[4] != '-' || pass[4] != '-'){
            setstatus("Incorrect Input(s)")
        }
        else if ((user[5] != '0' && user[5] != '1') || (pass[5] != '0'  && pass[5] != '1')){
            setstatus("Incorrect Input(s)")
        }
        else if (user[5] == '0' && user[6] != '1' && user[6] != '2'
            && user[6] != '3' && user[6] != '4' && user[6] != '5' && user[6] != '6'
            && user[6] != '7' && user[6] != '8' && user[6] != '9'){
            setstatus("Incorrect Input(s)")
        }
        else if (pass[5] == '0' && pass[6] != '1' && pass[6] != '2'
            && pass[6] != '3' && pass[6] != '4' && pass[6] != '5' && pass[6] != '6'
            && pass[6] != '7' && pass[6] != '8' && pass[6] != '9'){
            setstatus("Incorrect Input(s)")
        }
        else if (pass[5] == '1' && pass[6] != '1' && pass[6] != '2' && pass[6] != '0'){
            setstatus("Incorrect Input(s)")
        }
        else if (user[5] == '1' && user[6] != '1' && user[6] != '2' && user[6] != '0'){
            setstatus("Incorrect Input(s)")
        }
        else if (user >= "2020-01" && user < "2024-04" && pass > "2020-01" && pass <= "2024-04"
        && pass > user){
            setstatus("Correct Inputs")
            while(data.length > 0) {
                data.pop();
            }
            for (let i = 0; i<pdata.length; i++){
                if (pdata[i].date_ >= user && pdata[i].date_ <= pass){
                    data.push(pdata[i])
                }
            }
        }
        else{
            setstatus("Incorrect Input(s)")
        }



    }
    return (
        <>
            <h1 className="text-heading">What is the cumulative total number of incidents for different times of day?</h1>
            <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={data} margin={{left: 20}}>
                    <CartesianGrid/>
                    <XAxis dataKey="name" interval={"preserveStartEnd"}
                           label={{value: 'Time (Month)', angle: 0, position: 'bottom'}}
                    />
                    <YAxis label={{value: 'Number of Incidents', angle: -90, position: 'insideLeft'}}/>
                    <Legend
                        layout="vertical" verticalAlign="center" align="right"
                    />
                    <Tooltip/>
                    <Line
                        dataKey="Afternoon_Incidents"
                        stroke="black"
                        activeDot={{r: 8}}
                    />
                    <Line dataKey="Night_Incidents" stroke="red" activeDot={{r: 8}}/>
                    <Line dataKey="Latenight_Incidents" stroke="green" activeDot={{r: 8}}/>
                    <Line dataKey="Morning_Incidents" stroke="blue" activeDot={{r: 8}}/>
                </LineChart>
            </ResponsiveContainer>
            <div className="State">
                <label>Months must be between 2020-01 and 2024-04.</label>
            </div>
            <div className="Start">
                <label>Start Month: </label>
                <input type="text" placeholder="YYYY-MM"
                       onChange={(e) => setuser(e.target.value)}/>
            </div>
            <div className="Pass">
                <label>End Month: </label>
                <input type="text" placeholder="YYYY-MM"
                       onChange={(e) => setpass(e.target.value)}/>
            </div>
            <div className="Sub">
                <button onClick={check_sub}>Submit</button>
            </div>
            <div className="Status">
                <label>{status}</label>
            </div>
        </>
    );
}


export default Q1;
