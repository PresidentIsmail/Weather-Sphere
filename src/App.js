import React from "react";
import { useState, useReducer } from "react";

const api = {
  key: "5ff65f9312a8cae401312e90a53c45b8",
  base: "https://api.openweathermap.org/data/2.5/",
};

// set default state
const initialState = {
  location: "",
  weather: {},
  icon: "",
  description: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCATION":
      return {
        ...state,
        location:
          action.payload.charAt(0).toUpperCase() +
          action.payload.slice(1).toLowerCase(),
      }; // capitalize first letter
    case "SET_WEATHER":
      return { ...state, weather: action.payload };
    case "SET_ICON":
      return { ...state, icon: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // destructuring state
  const { location, weather, icon, description } = state;
  // destructuring weather
  const { temp, humidity, feels_like } = weather;

  return (
    <div className="app">
      <div className={`container ${!temp ? "only-search" : ""}`}>
        <div className="top-section">
          <Search dispatch={dispatch} location={location} />
        </div>

        {temp && (
          <>
            <div className="middle-section">
              <div className="location">
                <p>{location}</p>
              </div>

              <div className="temp">
                <h1>{Math.round(temp)}°C</h1>
              </div>

              <div className="icon">
                <img
                  src={`http://openweathermap.org/img/w/${icon}.png`}
                  alt="weather icon"
                />
              </div>

              <div className="description">{description}</div>
            </div>

            <div className="bottom-section">
              <div className="feels-like bold">
                <p>Feels like</p>
                <p>{Math.round(feels_like)}°C</p>
              </div>
              <div className="humidity bold">
                <p>Humidity</p>
                <p>{humidity}%</p>
              </div>
              <div className="wind bold">
                <p>Wind</p>
                <p>0.5 km/h</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// search component
const Search = ({ dispatch, location }) => {
  const [query, setQuery] = useState("");
  const url = `${api.base}weather?q=${query}&units=metric&appid=${api.key}`;

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        dispatch({ type: "SET_ERROR", payload: data.message });
        return;
      }

      dispatch({ type: "SET_LOCATION", payload: data.name });
      dispatch({ type: "SET_WEATHER", payload: data.main });
      dispatch({
        type: "SET_DESCRIPTION",
        payload: data.weather[0].description,
      });
      dispatch({ type: "SET_ICON", payload: data.weather[0].icon });

      console.log(data);
    }
  };

  // function when user types in the input field
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  // function when user clicks the clear button
  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Location.."
        value={query}
        onChange={handleChange}
        onKeyPress={searchLocation}
      />
      {query && (
        <button className="clear-button" onClick={handleClear}>
          X
        </button>
      )}
    </div>
  );
};
