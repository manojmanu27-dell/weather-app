import Home from "./components/home";
// import navigation from "./assets/location-icon.svg";
import { useState } from "react";
import earth from "./assets/test.png";
import "./App.css";
import cities from "./cities.json";
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// import location-icon.svg from './'
function App() {
  const [dropDown, setDropdown] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityList, setCityList] = useState([]);
  // const [placeHolder, setPlaceHolder] = useState("");
  return (
    <div className="main">
      <h1 className="heading">Weather App</h1>
      <div className="container">
        <div className="search-bar">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              <img src={earth} alt="city"></img>
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

      <Home />
    </div>
  );

  function selectCityObj(obj) {
    console.log("the object is", obj);
    setCityName(obj.name + "," + obj.state);
    setCityList([]);
    setDropdown(false);
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
      console.log("the city list is", matchingCityList);
      setCityList(matchingCityList);
    } else {
      setCityList([]);
    }
  }
}

// function getBestPlaces() {
//   console.log("the places are", cities);
// }

// async function run() {
//   // For text-only input, use the gemini-pro model

//   const genAI = new GoogleGenerativeAI(
//     "AIzaSyBLL2wllfkbbCl4LE3_HotOLkPdx07b2aA"
//   );

//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const prompt = "Best places to visit in Anantapur,Andhra Pradesh.";

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
// }

// run();

export default App;
