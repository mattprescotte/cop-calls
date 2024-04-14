import React from 'react';
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

// Sample chart data
const pdata = [
    {
        name: "2000",
        student: 11,
        fees: 120,
    },
    {
        name: "2001",
        student: 15,
        fees: 12,
    },
    {
        name: "2002",
        student: 5,
        fees: 10,
    },
    {
        name: "2003",
        student: 10,
        fees: 5,
    },
    {
        name: "2004",
        student: 9,
        fees: 4,
    },
    {
        name: "2006",
        student: 10,
        fees: 8,
    },
];

function Q1() {
    return (
        <>
            <h1 className="text-heading">Query 1 Graph</h1>
            <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={pdata} margin={{ right: 300 }}>
                    <CartesianGrid />
                    <XAxis dataKey="name" interval={"preserveStartEnd"}
                           label={{ value: 'No.Of Employees', angle: 0, position: 'bottom'}}
                    />
                    <YAxis label={{ value: 'No.Of Employees', angle: -90, position: 'insideLeft' }} />
                    <Legend
                        layout="horizontal" horizontalAlign="right" align="right"
                    />
                    <Tooltip />
                    <Line
                        dataKey="student"
                        stroke="black"
                        activeDot={{ r: 8 }}
                    />
                    <Line dataKey="fees" stroke="red" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}



export default Q1;