import {useEffect, useState} from "react";
import "../index.css";
import axios from "axios";
import SelectRegion from "./SelectRegion";

const Main = () => {
  const API_Key = process.env.REACT_APP_API_KEY;
  const [region, setRegion] = useState("");
  const [cityId, setCityId] = useState("1835848");
  const [currentTime, setCurrentTime] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  const choreData = async () => {
    await choreRegion;
  };

  const choreRegion = () => {
    setRegion();
  };

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_Key}`
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cityId]);

  return (
    <>
      <SelectRegion setCityId={setCityId} />
      <main className="w-screen h-screen flex flex-col justify-center items-center ">
        <div className="flex w-2/3 h-96 rounded-xl flex-col border-2">
          <div className="flex basis-60">
            <div className="flex flex-col m-4 w-2/5 border-2">
              <div className="basis-8 mt-2 ml-2 mr-2 w-8/12 border-2">
                {currentTime}
              </div>
              <div className="flex-1 basis-6 mt-2 ml-2 mr-2 border-2">
                {region}
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
            <div className="m-2 w-3/5 border-2">온도 박스</div>
          </div>
          <div className="flex basis-44">
            <div className="m-2 w-full border-2">부가 박스</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;
