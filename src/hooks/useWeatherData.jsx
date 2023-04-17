import axios from "axios";
import {useEffect, useState} from "react";

const API_Key = process.env.REACT_APP_API_KEY;

const useWeatherData = (
  cityId = "1835841",
  setIsWeatherDayTempLoaded,
  handleReload
) => {
  const [weatherState, setWeatherState] = useState(null);

  useEffect(() => {
    const getWeatherState = async () => {
      try {
        handleReload();
        setIsWeatherDayTempLoaded(false);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_Key}&lang=kr`
        );
        setWeatherState(response.data);
        setTimeout(() => {
          setIsWeatherDayTempLoaded(true);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    };
    getWeatherState();
  }, [cityId]);

  return weatherState;
};

export default useWeatherData;
