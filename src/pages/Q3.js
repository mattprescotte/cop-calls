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
    const response = await fetch('http://localhost:5000/arrest-proportions'); 
    const jsonData = await response.json();
    for (let num = 0; num < jsonData.length; num++){
        pdata.push({
            date_: jsonData[num][0],
            JuvenileArrestRate: jsonData[num][1],
            AdultArrestRate: jsonData[num][2]
        })
    }

  } catch (error) {
    console.error('Unable to fetch data:', error);
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
            <h1 className="text-heading">For juveniles and adults, how has the percent of incidents leading to an arrest changed over time?</h1>
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
