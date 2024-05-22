import Home from "./components/home";
import { useState, useEffect } from "react";
import location from "./assets/location.png";
import "./App.css";
import cities from "./cities.json";
import airesponse from "./response.json";
import Footer from "./layout/Footer";
import arrowUp from "./assets/increase.png";
import axios from "axios";
const { GoogleGenerativeAI } = require("@google/generative-ai");

function App() {
  const [dropDown, setDropdown] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityList, setCityList] = useState([]);
  const [weatherData, setWeatherData] = useState("");
  const [showHomePg, setShowHomePg] = useState(false);

  useEffect(() => {
    console.log("prcoess environmentis", process.env);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("the position is", position.coords);
        let obj = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        getWeatherData(obj);
      });
    } else {
      console.log("Geolocation is not available in the browser.");
    }
  }, []);

  function getWeatherData(position) {
    console.log("the positions we are receiving are", position);
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=97d9bbd401729426e9ac72dbd7caec67&units=metric`;
    axios.get(url).then((res) => {
      console.log("the response is", res);
      if (res.data) {
        setWeatherData(res.data);
        setShowHomePg(true);
        let defaultCity = cities.filter((obj) =>
          obj.name.toLowerCase().includes(res.data.name.toLowerCase())
        );
        if (defaultCity.length > 0) {
          setCityName(defaultCity[0].name + "," + defaultCity[0].state);
        }
      } else {
        setWeatherData({});
        setShowHomePg(false);
      }
    });
  }

  return (
    <div className="main">
      <h1 className="heading">Weather App</h1>
      <div className="container">
        <div className="search-bar">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <img src={location} alt="city"></img>
            </span>
            <input
              type="text"
              placeholder="Enter you City Here"
              aria-label="Username"
              value={cityName}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          {dropDown && cityList.length > 0 && (
            <div className="dropDown">
              <ul className="list-group">
                {cityList.map((v) => {
                  return (
                    <li
                      className="list-group-item"
                      key={v.id}
                      aria-current="true"
                      onClick={() => selectCityObj(v)}
                    >
                      {v.name + "," + v.state}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showHomePg && <Home weatherInfo={weatherData} />}
      {!showHomePg && (
        <div className="no-content">
          Please select city from Dropdown
          <img src={arrowUp} alt="arrow up" />
        </div>
      )}
      <Footer />
    </div>
  );
  async function run() {
    // For text-only input, use the gemini-pro model

    const genAI = new GoogleGenerativeAI(
      "AIzaSyBLL2wllfkbbCl4LE3_HotOLkPdx07b2aA"
    );

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `give me as an array of objects each object should contain serial number auto incremented for each object, name of the place, description of that place for top 3 places to visit in ${cityName}`;

    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // const text = response.text();
    // console.log(text);
    // setSuggetsion(text);
  }

  function selectCityObj(obj) {
    console.log("the object is", obj);
    setCityName(obj.name + "," + obj.state);
    setCityList([]);
    setDropdown(false);
    setShowHomePg(true);
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${obj.name}&appid=97d9bbd401729426e9ac72dbd7caec67`;
    axios.get(url);
    // run();
  }
  function handleInputChange(e) {
    setCityName(e.target.value);
    if (cityName.length >= 2) {
      setDropdown(true);
    } else {
      setDropdown(false);
    }
    if (dropDown) {
      let matchingCityList = cities.filter((obj) =>
        obj.name.toLowerCase().includes(cityName.toLowerCase())
      );
      setCityList(matchingCityList);
    } else {
      setCityList([]);
    }
  }
}

export default App;
