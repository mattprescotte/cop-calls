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
for (let num = 30*52; num >= 0; num -= 30){
    pdata.push({
        name: subDays(new Date(), num).toISOString().substr(0, 7),
        AfternoonIncidents: 50,
        NightIncidents: 10,
        LateNightIncidents: 20,
        MorningIncidents: 40
    })
}
for (let num = 0; num < pdata.length; num++){
    data.push(pdata[num])
}
function Q4() {
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
                if (pdata[i].name >= user && pdata[i].name <= pass){
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
            <h1 className="text-heading">Query 4 Graph</h1>
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
                        dataKey="AfternoonIncidents"
                        stroke="black"
                        activeDot={{r: 8}}
                    />
                    <Line dataKey="NightIncidents" stroke="red" activeDot={{r: 8}}/>
                    <Line dataKey="LateNightIncidents" stroke="green" activeDot={{r: 8}}/>
                    <Line dataKey="MorningIncidents" stroke="blue" activeDot={{r: 8}}/>
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


export default Q4;