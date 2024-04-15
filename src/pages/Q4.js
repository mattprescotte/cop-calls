import React from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis, ResponsiveContainer,
} from "recharts";

const Q4 = () => {
    // Sample data
    const data = [
        { name: "Battery - Simple Assault", Victims_of_Battery: 75621 },
        { name: "Assault With Deadly Weapon, Aggravated Assault", Victims_of_Assault_with_DW: 53764 },
        { name: "Intimate Partner - Simple Assault", Victims_of_Intimate_Partner_SimpA: 48470 }
    ];

    return (
        <>
        <h1 className="text-heading">The Top Three Crimes Committed Against the Largest Group of Victims by Heritage</h1>
        <ResponsiveContainer width="100%" aspect={3}>
            <BarChart data={data} margin={{left: 20}}>
                <Bar dataKey="Victims_of_Battery" fill="green" />
                <Bar dataKey="Victims_of_Assault_with_DW" fill="blue" />
                <Bar dataKey="Victims_of_Intimate_Partner_SimpA" fill="red" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name"  label={{value: 'Crime', angle: 0, position: 'bottom'}}/>
                <YAxis label={{value: 'Crimes', angle: -90, position: 'insideLeft'}} />
            </BarChart>
        </ResponsiveContainer>
        </>
    );
};

export default Q4;