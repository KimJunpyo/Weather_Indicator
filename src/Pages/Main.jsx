import {useEffect, useState} from "react";
import "../index.css";
import axios from "axios";
import SelectRegion from "../components/SelectRegion";
const Main = () => {
  const API_Key = process.env.REACT_APP_API_KEY;
  const [region, setRegion] = useState("");
  const [cityId, setCityId] = useState("1835848");
  const [currentTime, setCurrentTime] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [otherForecast, setOtherForecast] = useState({
    wind: 0,
    rain: 0,
    clouds: 0,
    humidity: 0,
    visibility: 0,
  });
  const [weather, setWeather] = useState({main: "", description: ""});

  const [A, setA] = useState("");
  const handleTempData = (tempArray) => {
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;

    tempArray.forEach((dayTemp) => {
      max = Math.max(dayTemp.main.temp_max, max);
      min = Math.min(dayTemp.main.temp_min, min);
    });

    setMaxTemp(`${Math.round(max - 273.15)}°C`);
    setMinTemp(`${Math.round(min - 273.15)}°C`);
  };

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_Key}&lang=kr`
      )
      .then((response) => {
        setRegion(response.data.name);
        setCurrentTime(new Date(response.data.dt * 1000).toLocaleString());
        setSunrise(() =>
          new Date(response.data.sys.sunrise * 1000).toLocaleTimeString()
        );
        setSunset(() =>
          new Date(response.data.sys.sunset * 1000).toLocaleTimeString()
        );
        setWeatherIcon(
          `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        );
        setTemp(`${Math.round(response.data.main.temp - 273.15)}°C`);
        setFeelsLike(
          `체감온도: ${Math.round(response.data.main.feels_like - 273.15)}°C`
        );
        setWeather((current) => {
          const tempObj = {
            ...current,
            main: response.data.weather[0].main,
            description: response.data.weather[0].description,
          };
          return tempObj;
        });
        setOtherForecast((current) => {
          const tempObj = {
            ...current,
            wind: `${response.data.wind.speed}m/s`,
            rain: `${
              response.data.rain === undefined
                ? "not raining"
                : `${response.data.rain["1h"]}mm`
            }`,
            clouds: `${response.data.clouds.all}%`,
            humidity: `${response.data.main.humidity}%`,
            visibility: `${response.data.visibility / 1000}Km`,
          };
          return tempObj;
        });

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_Key}`
          )
          .then((response) => {
            handleTempData(response.data.list.slice(0, 9));
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cityId]);

  useEffect(() => {
    switch (weather.main) {
      case "Rain":
        setA("bg-[#dbd7d7]");
        break;
      case "Clear":
        setA("bg-[#f7e3b7]");
        break;
      case "Clouds":
        setA("bg-[#ededed]");
        break;
      case "Fog":
        setA("bg-[#d4ffe1]");
        break;
      case "Mist":
        setA("bg-[#e8faf4]");
        break;
      case "Drizzle":
        setA("bg-[#d7edfa]");
        break;
    }
  }, [weather.main]);
  return (
    <>
      <SelectRegion setCityId={setCityId} />
      <main
        className={`w-screen h-screen flex flex-col justify-center items-center ${A}`}
      >
        <div className="flex w-2/3 h-96 rounded-xl flex-col border-2 bg-[#ffffff]">
          <div className="flex basis-60">
            <div className="flex flex-col m-4 w-2/5 border-2">
              <div className="basis-8 mt-2 ml-2 mr-2 w-8/12 border-2">
                {currentTime}
              </div>
              <div className="flex-1 basis-6 mt-2 ml-2 mr-2 border-2 flex justify-center items-center">
                <div className="text-4xl">{region}</div>
                <div className="m-2 pt-4">{feelsLike}</div>
              </div>
              <div className="flex-1 mt-2 mb-2 ml-2 mr-2 flex">
                <div className="w-full border-2 mr-2">
                  일출
                  <br />
                  {sunrise}
                </div>
                <div className="w-full border-2">
                  일몰
                  <br />
                  {sunset}
                </div>
              </div>
            </div>
            <div className="mr-4 mt-4 mb-4 w-3/5 border-2 flex justify-center align-center pt-2 pb-2">
              <div className="border-2 w-full ml-4 flex justify-around items-center">
                <img
                  className="border-2 m-2 w-28 h-28"
                  src={weatherIcon}
                  alt="기상 아이콘"
                />
                <div className="border-2 m-2 w-28 h-28 flex justify-center items-center text-4xl">
                  {temp}
                </div>
              </div>
              <div className="border-2 w-full mr-4 ml-4 flex flex-col justify-center p-2">
                <div className="border-2 w-full h-1/2 mb-3 text-2xl flex justify-center items-center">
                  {weather.main} {weather.description}
                </div>
                <div className="border-2 w-2/3 h-2/6 text-xl flex justify-center items-center">{`${maxTemp} / ${minTemp}`}</div>
              </div>
            </div>
          </div>
          <div className="flex basis-44">
            <div className="pr-2 pl-2 pb-4 flex justify-center items-end mr-4 ml-4 mb-4 w-full border-2">
              {Object.entries(otherForecast).map((e) => (
                <div className="m-1 w-1/5 h-4/6 border-2 flex justify-center items-center">
                  {e[0]}: {e[1]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;
