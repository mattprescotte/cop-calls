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
    const response = await fetch('http://localhost:5000/home-victims?timeUnits=Month&standardColumn=True'); 
    const jsonData = await response.json();
    for (let num = 0; num < jsonData.length; num++){
        pdata.push({
            date_: jsonData[num][0],
            MinorHomeVictimization: jsonData[num][1],
            AllHomeVictimization: jsonData[num][2]
        })
    }

  } catch (error) {
    console.error('Unable to fetch data:', error);
  }
for (let num = 0; num < pdata.length; num++){
    data.push(pdata[num]) 
}


function Q2() {
    const [minDate, setMinDate] = useState("")
    const [maxDate, setMaxDate] = useState("")
    const [status, setstatus] = useState("")
    const check_sub = () => {
        if (minDate.length != 7 || maxDate.length != 7){
            setstatus("Incorrect Input(s)")
        }
        else if (minDate[4] != '-' || maxDate[4] != '-'){
            setstatus("Incorrect Input(s)")
        }
        else if ((minDate[5] != '0' && minDate[5] != '1') || (maxDate[5] != '0'  && maxDate[5] != '1')){
            setstatus("Incorrect Input(s)")
        }
        else if (minDate[5] == '0' && minDate[6] != '1' && minDate[6] != '2'
            && minDate[6] != '3' && minDate[6] != '4' && minDate[6] != '5' && minDate[6] != '6'
            && minDate[6] != '7' && minDate[6] != '8' && minDate[6] != '9'){
            setstatus("Incorrect Input(s)")
        }
        else if (maxDate[5] == '0' && maxDate[6] != '1' && maxDate[6] != '2'
            && maxDate[6] != '3' && maxDate[6] != '4' && maxDate[6] != '5' && maxDate[6] != '6'
            && maxDate[6] != '7' && maxDate[6] != '8' && maxDate[6] != '9'){
            setstatus("Incorrect Input(s)")
        }
        else if (maxDate[5] == '1' && maxDate[6] != '1' && maxDate[6] != '2' && maxDate[6] != '0'){
            setstatus("Incorrect Input(s)")
        }
        else if (minDate[5] == '1' && minDate[6] != '1' && minDate[6] != '2' && minDate[6] != '0'){
            setstatus("Incorrect Input(s)")
        }
        else if (minDate >= "2020-01" && minDate < "2024-04" && maxDate > "2020-01" && maxDate <= "2024-04"
            && maxDate > minDate){
            setstatus("Correct Inputs")
            while(data.length > 0) {
                data.pop();
            }
            for (let i = 0; i<pdata.length; i++){
                if (pdata[i].date_ >= minDate && pdata[i].date_ <= maxDate){
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
            <h1 className="text-heading">For minors and all victims, how has the percent of incidents happening in a residence changed since COVID? </h1>
            <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={data} margin={{left: 20}}>
                    <CartesianGrid/>
                    <XAxis dataKey="date_" interval={"preserveStartEnd"}
                           label={{value: 'Time (Month)', angle: 0, position: 'bottom'}}
                    />
                    <YAxis label={{value: 'Rate of Incidents', angle: -90, position: 'insideLeft'}}/>
                    <Legend
                        layout="vertical" verticalAlign="center" align="right"
                    />
                    <Tooltip/>
                    <Line
                        dataKey="AllHomeVictimization"
                        stroke="black"
                        activeDot={{r: 8}}
                    />
                    <Line dataKey="MinorHomeVictimization" stroke="red" activeDot={{r: 8}}/>

                </LineChart>
            </ResponsiveContainer>
            <div className="State">
                <label>Months must be between 2020-01 and 2024-04.</label>
            </div>
            <div className="Start">
                <label>Start Month: </label>
                <input type="text" placeholder="YYYY-MM"
                       onChange={(e) => setMinDate(e.target.value)}/>
            </div>
            <div className="Pass">
                <label>End Month: </label>
                <input type="text" placeholder="YYYY-MM"
                       onChange={(e) => setMaxDate(e.target.value)}/>
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


export default Q2;
