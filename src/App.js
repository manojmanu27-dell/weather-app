import Home from "./components/home";
import { useState, useEffect } from "react";
import location from "./assets/location.png";
import "./App.css";
import cities from "./cities.json";
// import airesponse from "./response.json";
import Footer from "./layout/Footer";
import arrowUp from "./assets/increase.png";
import axios from "axios";
import moment from "moment";
// import PopupGfg from "./components/alert/alert";
const { GoogleGenerativeAI } = require("@google/generative-ai");

function App() {
  const [dropDown, setDropdown] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityList, setCityList] = useState([]);
  const [weatherData, setWeatherData] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [showHomePg, setShowHomePg] = useState(false);
  const [airQuality, setAirQuaity] = useState(false);
  const [loader, setLoader] = useState(false);
  let weatherKey = "97d9bbd401729426e9ac72dbd7caec67";
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
    setLoader(true);
    console.log("the positions we are receiving are", position);
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherKey}&units=metric`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherKey}&units=metric`;
    let airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherKey}`;
    axios
      .get(url)
      .then((res) => {
        axios
          .get(forecastUrl)
          .then((res) => {
            console.log("the forecase data is", res);
            let arr = res.data.list;
            let day = moment().format("dddd");
            let today = moment().add(1, "day").startOf("day").valueOf();
            let j = 1;
            let temp = 0;
            let humidity = 0;
            let windSpeed = 0;
            let divideVal = 0;
            let forecastArr = [];
            for (let i = 0; i < arr.length; i++) {
              if (today - arr[i].dt * 1000 > 0) {
                temp += arr[i].main.temp;
                humidity += arr[i].main.humidity;
                windSpeed += arr[i].wind.speed;
                divideVal++;
                console.log("the data is ", j, arr[i].dt_txt);
              } else {
                forecastArr.push({
                  day: day,
                  temp: parseFloat(temp / divideVal).toFixed(2),
                  humidity: parseFloat(humidity / divideVal).toFixed(2),
                  windSpeed: parseFloat(windSpeed / divideVal).toFixed(2),
                });
                divideVal = 0;
                temp = 0;
                humidity = 0;
                windSpeed = 0;
                j++;
                day = moment(today).format("dddd");
                today = moment().add(j, "day").startOf("day").valueOf();
              }
            }
            setForecastData(forecastArr);
            setLoader(false);
            setShowHomePg(true);
          })
          .catch((err) => {
            setLoader(false);
          });
        axios
          .get(airQualityUrl)
          .then((airData) => {
            console.log("the airData data is", airData);
            let obj = {
              1: "Good",
              2: "Fair",
              3: "Moderate",
              4: "Poor",
              5: "Very Poor",
            };
            setAirQuaity(obj[airData.data.list[0].main.aqi]);
          })
          .catch((err) => {
            setLoader(false);
          });
        console.log("the response is", res);
        if (res.data) {
          setWeatherData(res.data);
          setShowHomePg(true);
          let defaultCity = cities.filter((obj) =>
            obj.name.toLowerCase().includes(res.data.name.toLowerCase())
          );
          if (defaultCity.length > 0) {
            setCityName(defaultCity[0].name + "," + defaultCity[0].state);
            suggestionType("");
          }
        } else {
          setWeatherData({});
          setShowHomePg(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  }

  return (
    <div className="main">
      {/* <PopupGfg /> */}
      {loader && (
        <div className="show-loader">
          <div className="blur-bg"></div>
          <div className="loader position-absolute"></div>
        </div>
      )}
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
      {/* <div className="card">
        <button
          className="btn btn-success"
          onClick={() => suggestionType("test")}
        >
          Test
        </button>
        <div className="card-body">
          <pre>{aiSuggestion}</pre>
        </div>
      </div> */}
      {showHomePg && (
        <Home
          weatherInfo={weatherData}
          airQuality={airQuality}
          forecastInfo={forecastData}
          suggestionType={suggestionType}
          aiSuggestion={aiSuggestion}
        />
      )}
      {!showHomePg && (
        <div className="no-content">
          Please select city from Dropdown
          <img src={arrowUp} alt="arrow up" />
        </div>
      )}
      <Footer />
    </div>
  );
  async function suggestionType(type) {
    setLoader(true);
    console.log("the suggestions are", aiSuggestion);
    // For text-only input, use the gemini-pro model
    const genAI = new GoogleGenerativeAI(
      "AIzaSyBLL2wllfkbbCl4LE3_HotOLkPdx07b2aA"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    let prompt = `best places in ${cityName} with the headings underlined`;
    // let prompt = `give me as an array of objects each object should contain serial number auto incremented for each object, name of the place, description of that place for top 3 places to visit in ${cityName}`;
    if (type === "Agriculture") {
      prompt = `Based on the following conditions in ${cityName}, India, suggest the most suitable crop to plant and provide an estimated market price as of today:
      Temperature: ${weatherData.main.temp} degrees Celsius
      Humidity: ${weatherData.main.humidity} percent`;
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.split("*");
    text = text.join("");
    console.log(text);
    setAiSuggestion(text);
    setLoader(false);
  }

  function selectCityObj(obj) {
    console.log("the object is", obj);
    setCityName(obj.name + "," + obj.state);
    setCityList([]);
    setDropdown(false);
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${obj.name}&appid=${weatherKey}`;
    axios.get(url).then((res) => {
      console.log("The api respomse s", res);
      let obj = {
        latitude: res.data[0].lat,
        longitude: res.data[0].lon,
      };
      suggestionType("");
      getWeatherData(obj);
    });
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
