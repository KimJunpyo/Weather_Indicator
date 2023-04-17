import axios from "axios";
import {useEffect, useState} from "react";

const API_Key = process.env.REACT_APP_API_KEY;

const useWeatherDayTemp = (
  cityId = "1835841",
  setIsWeatherDataLoaded,
  handleReload
) => {
  const [weatherDayTemp, setWeatherDayTemp] = useState(null);

  useEffect(() => {
    const getWeatherDayTemp = async () => {
      try {
        handleReload();
        setIsWeatherDataLoaded(false);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_Key}`
        );
        setWeatherDayTemp(response.data.list.slice(0, 9));
        setTimeout(() => {
          setIsWeatherDataLoaded(true);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    };
    getWeatherDayTemp();
  }, [cityId]);

  return weatherDayTemp;
};

export default useWeatherDayTemp;
