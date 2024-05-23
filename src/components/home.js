import { useState } from "react";
import humidityIcon from "../assets/humidity.svg";
import rainGif from "../assets/rainy.png";
import windIcon from "../assets/wind.svg";
import airIcon from "../assets/air-purifier.png";
import "./home.css";

export default function Home({
  weatherInfo,
  forecastInfo,
  airQuality,
  suggestionType,
  aiSuggestion,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [sugAgri, setSugAgri] = useState(false);
  const [sugTra, setSugTra] = useState(true);
  const [showMsg, setShowMsg] = useState(true);
  // setTimeout(() => parseTheInput(), 10000);
  const [styleCss, setStyleCss] = useState({});
  console.log("the props data is ", weatherInfo);
  return (
    <div className="display-weather">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
          <div className="card">
            <div className="card-title">Today’s Weather</div>

            <div className="col-list row">
              <div className="temp col-lg-6 col-md-6 col-sm-12">
                <img src={rainGif} className="temp-gif" alt="icon" />
                <span className="celsius">{weatherInfo.main.temp}°C</span>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row">
                <div className="humidity col-md-12 col-6 mb-2">
                  <div className="row">
                    <img
                      className="details-list p-0"
                      src={humidityIcon}
                      alt="icon"
                    />
                    <div className="col-6 p-0 sub">
                      <span className="sub-head">
                        {weatherInfo.main.humidity} %
                      </span>{" "}
                      <br />
                      Humidity
                    </div>
                  </div>
                </div>
                <div className="wind col-md-12 col-6 mb-2">
                  <div className="row ">
                    <img
                      className="details-list p-0"
                      src={windIcon}
                      alt="icon"
                    />
                    <div className="col-6 p-0 sub">
                      <span className="sub-head">
                        {weatherInfo.wind.speed} m/s
                      </span>{" "}
                      <br /> Wind Speed
                    </div>
                  </div>
                </div>
                <div className="air-quality col-12 mb-2">
                  <div className="row">
                    <img
                      className="details-list p-0"
                      src={airIcon}
                      alt="icon"
                    />
                    <div className="col-6 p-0 sub">
                      <span className="sub-head">{airQuality}</span> <br /> Air
                      Quality
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-title">Forecast</div>
            <div className="card-body">
              <table className="table table-striped table-responsive">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Temp</th>
                    <th>Humidity</th>
                    <th>Wind Speed (m/s)</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastInfo.length > 0 &&
                    forecastInfo.map((obj, i) => {
                      return (
                        <tr key={i}>
                          <td>{obj.day}</td>
                          <td>{obj.temp} </td>
                          <td>{obj.humidity}</td>
                          <td>{obj.windSpeed}</td>
                        </tr>
                      );
                    })}
                  {forecastInfo.length === 0 && (
                    <tr>
                      <td colSpan="5"> No Data Available at this moment....</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="card suggestion-list" style={styleCss}>
            <div className="card-title">
              What do you like Suggestions On:
              <div className="radio-button-group">
                <div className="radio-btn">
                  <input
                    type="radio"
                    className="form-check-input"
                    value={sugAgri}
                    onClick={(e) => {
                      handleSuggestions(e, "Agriculture");
                    }}
                    checked={sugAgri}
                  />
                  <label htmlFor="Agriculture">Agriculture</label>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    className="form-check-input"
                    value={sugTra}
                    onClick={(e) => {
                      handleSuggestions(e, "Travel");
                    }}
                    checked={sugTra}
                  />
                  <label htmlFor="Travel">Travel</label>
                </div>
              </div>
            </div>
            <pre className="suggestions-block">{aiSuggestion}</pre>
            {!aiSuggestion && (
              <h5 className="text-center">Oops, Something went wrong....</h5>
            )}
            {/* {showMsg && (
              <div className="loading-content">
                <h5 className="text-center">Suggestions are on the way</h5>
                <span className="loader"></span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );

  function parseTheInput() {
    let resp = {
      suggestion:
        '```\n[\n  {\n    "serial_number": 1,\n    "name": "Mona Lisa",\n    "description": "A masterpiece of the Italian Renaissance, the Mona Lisa is one of the most famous and iconic paintings in the world. It depicts a woman with an enigmatic smile, and is believed to have been painted by Leonardo da Vinci in the early 16th century. The painting is currently housed in the Louvre Museum in Paris."\n  },\n  {\n    "serial_number": 2,\n    "name": "Eiffel Tower",\n    "description": "The Eiffel Tower is a wrought iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. The Eiffel Tower was built as the entrance arch for the 1889 World\'s Fair, and was originally intended to be a temporary structure. However, it has become one of the most recognizable landmarks in the world and is now a popular tourist destination."\n  },\n  {\n    "serial_number": 3,\n    "name": "Taj Mahal",\n    "description": "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal. The Taj Mahal is widely considered to be one of the finest examples of Mughal architecture and is a UNESCO World Heritage Site."\n  }\n]\n```',
    };
    resp.suggestion = resp.suggestion.replace("```", "");
    resp.suggestion = resp.suggestion.replace("```", "");
    // setTimeout(()=>{

    //   // let resp = props.suggestion?.candidates[0]?.content?.parts[0]?.text;
    setSuggestions(JSON.parse(resp.suggestion));
    console.log("the details are", typeof suggestions);
    setStyleCss({
      overflowY: "scroll",
    });
    // },10000)
    // if (resp) {
    //   let resultArr = resp.split("**");
    //   console.log("the result array is",resultArr)
    //   // setSuggestions();
    // }
  }

  function handleSuggestions(e, type) {
    setShowMsg(true);
    console.log(e, type);
    suggestionType(type);
    if (type === "Agriculture") {
      setSugTra(false);
      setSugAgri(true);
    } else {
      setSugTra(true);
      setSugAgri(false);
    }
    console.log(" the ai suggestion is", aiSuggestion);
    setTimeout(() => setShowMsg(false), 1000);
  }
}
