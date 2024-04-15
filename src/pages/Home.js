import Q1 from "./Q1";
import {Text} from "recharts";

function Home() {
    return (<div className="App">
        <h1>How has crime in Los Angeles persisted and evolved since the start of the COVID-19 Pandemic?</h1>
        <div className="description">
            <p>
                Crime in LA has shifted over the last four years. On the webpage, we'll bring you <br></br> through some of those shifts to help you understand both the state of <br></br>crime and policing and how they're changing in this city. There will be <br></br>emphasis on the influences of the Pandemic and how it has, and hasn't, changed <br></br>how incidents occur in LA.
            </p>
        </div>
        <div className="Q1">
            <Text>Perspective 1: The cumulative number of incidents over time for different times of day.</Text>
        </div>
        <br></br>
        <div className="Pass">
            <Text>Perspective 2: The rate of incidents that happened in a residency where minors were the victim over time.</Text>
        </div>
        <br></br>

        <div className="Status">
            <Text>Perspective 3: The arrest rate over time for juveniles as an identified incident perpetrator vs. adults.</Text>
        </div>
        <br></br>

        <div className="LB">
            <Text>Perspective 4: </Text>
        </div>
        <br></br>

        <div className="RB">
            <Text>Perspective 5: </Text>
        </div>
    </div>)

}

export default Home;
