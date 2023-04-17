import {useEffect, useState} from "react";
import "../index.css";
import SelectRegion from "../components/SelectRegion";
import WEATHER_BACKGROUND_MODE from "../assets/ConstData";
import useWeatherData from "../hooks/useWeatherData";
import useWeatherDayTemp from "../hooks/useWeatherDayTemp";
const Main = () => {
  const API_Key = process.env.REACT_APP_API_KEY;
  const [region, setRegion] = useState("");
  const [cityId, setCityId] = useState("1835841");
  const [currentTime, setCurrentTime] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [otherForecast, setOtherForecast] = useState({
    wind: 0,
    rain: 0,
    clouds: 0,
    humidity: 0,
    visibility: 0,
  });

  const handleReload = () => {
    setIsLoading(true);
  };
  const [weather, setWeather] = useState({main: "", description: ""});
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [backGround, setBackGround] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWeatherDataLoaded, setIsWeatherDataLoaded] = useState(false);
  const [isWeatherDayTempLoaded, setIsWeatherDayTempLoaded] = useState(false);

  const weatherData = useWeatherData(
    cityId,
    setIsWeatherDataLoaded,
    handleReload
  );
  const weatherDayTemp = useWeatherDayTemp(
    cityId,
    setIsWeatherDayTempLoaded,
    handleReload
  );

  const changeTempData = (tempArray) => {
    if (tempArray === null) return;
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    tempArray.forEach((e) => {
      max = Math.max(e.main.temp_max, max);
      min = Math.min(e.main.temp_min, min);
    });

    setMaxTemp(`${Math.round(max - 273.15)}°C`);
    setMinTemp(`${Math.round(min - 273.15)}°C`);
  };

  useEffect(() => {
    console.log("loading...");
    if (isWeatherDataLoaded && isWeatherDayTempLoaded) {
      setIsLoading(false);
    }
  }, [isWeatherDataLoaded, isWeatherDayTempLoaded]);

  useEffect(() => {
    if (weatherData) {
      setRegion(weatherData.name);
      setCurrentTime(new Date(weatherData.dt * 1000).toLocaleString());
      setSunrise(() =>
        new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()
      );
      setSunset(() =>
        new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()
      );
      setWeatherIcon(
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      );
      setTemp(`${Math.round(weatherData.main.temp - 273.15)}°C`);
      setFeelsLike(
        `체감온도: ${Math.round(weatherData.main.feels_like - 273.15)}°C`
      );
      setWeather((current) => {
        return {
          ...current,
          main: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
        };
      });
      setOtherForecast((current) => {
        return {
          ...current,
          wind: `${weatherData.wind.speed}m/s`,
          rain: `${
            weatherData.rain === undefined
              ? "not raining"
              : `${weatherData.rain["1h"]}mm`
          }`,
          clouds: `${weatherData.clouds.all}%`,
          humidity: `${weatherData.main.humidity}%`,
          visibility: `${weatherData.visibility / 1000}Km`,
        };
      });
    }
  }, [weatherData]);

  useEffect(() => {
    changeTempData(weatherDayTemp);
  }, [weatherDayTemp]);

  useEffect(() => {
    setBackGround(WEATHER_BACKGROUND_MODE[weather.main]);
  }, [weather.main]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <SelectRegion setCityId={setCityId} />
          <main
            className={`w-screen h-screen flex flex-col justify-center items-center ${backGround}`}
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
                    <div
                      key={e[0]}
                      className="m-1 w-1/5 h-4/6 border-2 flex justify-center items-center"
                    >
                      {e[0]}: {e[1]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Main;
