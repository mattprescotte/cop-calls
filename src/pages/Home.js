import Q1 from "./Q1";
import {Text} from "recharts";

function Home() {
    return (<div className="App">
        <h1>Home</h1>
        <div className="Q1">
            <Text>Query 1: The cumulative number of incidents over time for different times of day</Text>
        </div>
        <div className="Pass">
            <Text>Query 2: The rate of incidents that happened in a residency where minors were the victim over time</Text>
        </div>
        <div className="Status">
            <Text>Query 3: The arrest rate over time for juveniles as an identified incident perpetrator vs. adults</Text>
        </div>
        <div className="LB">
            <Text>Query 4: </Text>
        </div>
        <div className="RB">
            <Text>Query 5: </Text>
        </div>
    </div>)

}

export default Home;