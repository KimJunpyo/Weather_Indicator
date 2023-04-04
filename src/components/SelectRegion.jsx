import REGION from "../assets/RegionList";

const SelectRegion = ({setCityId}) => {
  const handleChangeSelect = (e) => {
    setCityId(e.target.value);
  };
  return (
    <>
      <div>
        <select className="absolute top-0 left-0" onChange={handleChangeSelect}>
          {REGION.map((e) => (
            <option value={e.id} key={e.id}>
              {e.city}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SelectRegion;
