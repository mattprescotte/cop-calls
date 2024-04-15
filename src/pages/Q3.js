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
for (let num = 365*4; num >= 0; num -= 365){
    pdata.push({
        name: subDays(new Date(), num).toISOString().substr(0, 4),
        AdultArrestRate: 50,
        JuvenileArrestRate: 10
    })
}
for (let num = 0; num < pdata.length; num++){
    data.push(pdata[num])
}
function Q3() {
    const [user, setuser] = useState("")
    const [pass, setpass] = useState("")
    const [status, setstatus] = useState("")
    const check_sub = () => {
        if (user.length != 4 || pass.length != 4){
            setstatus("Incorrect Input(s)")
        }
        else if (user >= "2020" && user < "2024" && pass > "2020" && pass <= "2024"
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
            <h1 className="text-heading">Query 3 Graph</h1>
            <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={data} margin={{left: 20}}>
                    <CartesianGrid/>
                    <XAxis dataKey="name" interval={"preserveStartEnd"}
                           label={{value: 'Time (Year)', angle: 0, position: 'bottom'}}
                    />
                    <YAxis label={{value: 'Arrest Rate', angle: -90, position: 'insideLeft'}}/>
                    <Legend
                        layout="vertical" verticalAlign="center" align="right"
                    />
                    <Tooltip/>
                    <Line
                        dataKey="JuvenileArrestRate"
                        stroke="black"
                        activeDot={{r: 8}}
                    />
                    <Line dataKey="AdultArrestRate" stroke="red" activeDot={{r: 8}}/>

                </LineChart>
            </ResponsiveContainer>
            <div className="State">
                <label>Years must be between 2020 and 2024.</label>
            </div>
            <div className="Start">
                <label>Start Year: </label>
                <input type="text" placeholder="YYYY"
                       onChange={(e) => setuser(e.target.value)}/>
            </div>
            <div className="Pass">
                <label>End Year: </label>
                <input type="text" placeholder="YYYY"
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


export default Q3;