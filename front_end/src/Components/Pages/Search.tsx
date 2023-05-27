import {
  Button,
  Input,
  Radio,
  RadioChangeEvent,
  Checkbox,
  Form,
  Slider,
  DatePicker,
  Select,
  TimePicker,
} from "antd";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import { StoryInt } from "../../Interfaces/StoryInt";
import Story from "../Components/StoryCard";
import dayjs from "dayjs";
interface storySearchData {
  name?: string;
  text?: string;
  header?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  label?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  radius?: number;
  startSeason?: string;
  endSeason?: string;
}

const containerStyle = {
  width: "50%",
  height: "400px",
};

interface UserSearchResult {
  name: string;
  id: number;
}
interface Location {
  name: string;
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}
type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Exact Date", value: "exact-year" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const exactDateFormat = "DD/MM/YYYY";
const yearFormat = "YYYY";
const monthFormat = "MM/YYYY";

const decadeOption: Option[] = [
  { label: "Date", value: "date" },
  { label: "Decade", value: "decade" },
  
];

const searchOptions: Option[] = [
  { label: "User", value: "user" },
  { label: "Story", value: "story" },
];

const searchDateOptions: Option[] = [
  { label: "Exact Date Search", value: "one_date" },
  { label: "Interval Search", value: "interval" },
];

const UserSearch: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleSubmit = async (event: any) => {
    const searchData: storySearchData = {
      name,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/findusers`,
        searchData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Redirect or update the state based on successful login
        console.log("Login successful");
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <Row>
          <Input.Search
            onChange={handleNameChange}
            placeholder="Write username"
          ></Input.Search>
        </Row>
        <Row>
          <Button onClick={handleSubmit}> Search</Button>
        </Row>
      </Container>
      {users.length > 0 && (
        <>
          <h2>Results</h2>
          <ul style={{ listStyle: "none", marginRight: "10px" }}>
            {users.reverse().map((user: UserSearchResult) => (
              <li key={user.id}>
                <div>
                  <Link to={`/user/${user.name}`}>
                    <p>{user.name}</p>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const api_key = import.meta.env.VITE_GOOGLE_API_KEY;

const StroySearch: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 41.0856396,
    lng: 29.0424937,
  });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [stories, setStories] = useState<StoryInt[]>();
  const [locations, setLocations] = useState<Location>();
  const [header, setHeader] = useState<string>();
  const [name, setName] = useState<string>();
  const [city, setCity] = useState<string>();
  const [label, setLabel] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endtDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [text, setText] = useState<string>();
  const [radius, setRadius] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<string>("exact-year");
  const [selectedDateOption, setSelectedDateOption] =
    useState<string>("one_date");
  const [selectedSeason, setSelectedSeason] = useState<string>();
  const [selectedSeasonEnd, setSelectedSeasonEnd] = useState<string>();
  const [selectedOptionEnd, setSelectedOptionEnd] =
    useState<string>("exact-year");
    const [selectedDateInput, setSelectedDateInput] = useState<string>("date");

  const [form] = Form.useForm();

  const seasonOptions = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "fall", label: "Fall" },
    { value: "winter", label: "Winter" },
  ];
  const dateFormats: { [key: string]: string } = {
    "exact-year": "DD/MM/YYYY",
    month: "MM/YYYY",
    year: "YYYY",
  };
  const dateFormatsForDisable: { [key: string]: dayjs.ManipulateType } = {
    "exact-year": "day",
    month: "month",
    year: "year",
  };
  const [selectedDecadeValue, setSelectedDecadeValue] = useState<number>();
  const onRadioChangeInput = (e: RadioChangeEvent) => {
    setSelectedDateInput(e.target.value);
  };
  const decadeSelectOptions = [
    { value: 1901, label: "1900s" },
    { value: 1911, label: "1910s" },
    { value: 1921, label: "1920s" },
    { value: 1931, label: "1930s" },
    { value: 1941, label: "1940s" },
    { value: 1951, label: "1950s" },
    { value: 1961, label: "1960s" },
    { value: 1971, label: "1970s" },
    { value: 1981, label: "1980s" },
    { value: 1991, label: "1990s" },
    { value: 2001, label: "2000s" },
    { value: 2011, label: "2010s" },
    { value: 2025, label: "2020s" },
  ];

  const combinedEndDateTimeString = `${
    endtDate && selectedOptionEnd === "exact-year"
      ? dayjs(`${endtDate.format("YYYY-MM-DD")}`).format("DD/MM/YYYY HH:mm:ss")
      : endtDate?.format(dateFormats[selectedOptionEnd])
  }`;

  const onFinish = async () => {
    const searchData: storySearchData = {
      ...(name && { name: name }),
      ...(text && { text: text }),
      ...(header && { header: header }),
      ...(locations?.lat && { latitude: locations?.lat }),
      ...(locations?.lng && { longitude: locations?.lng }),
      ...(locations?.lng && { radius: radius }),
      ...(city && { city: city }),
      ...(country && { country: country }),
      ...(label && { label: label }),
      ...(startDate && {
        startDate: startDate?.format(dateFormats[selectedOption]),
      }),
      ...(endtDate && {
        endDate: endtDate?.format(dateFormats[selectedOptionEnd]),
      }),
      ...(selectedSeason && { startSeason: selectedSeason }),
      ...(selectedSeasonEnd && { endSeason: selectedSeasonEnd }),
    };
    const allFieldsEmpty = Object.values(searchData).every(
      (value) => value === undefined || value === ""
    );
    const search_url =
      selectedOption === "one_day"
        ? `${import.meta.env.VITE_BACKEND_URL}/stories/search`
        : `${import.meta.env.VITE_BACKEND_URL}/stories/intervalsearch`;

    if (allFieldsEmpty) {
      alert("No search criteria provided");
      return;
    } else {
      try {
        console.log(searchData);
        const response = await axios.post(search_url, searchData, {
          withCredentials: true,
        });

        if (response.status === 200) {
          // Redirect or update the state based on successful login
          console.log(response.data);

          setStories(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt_Token"))
      ?.split("=")[1];

    if (!cookieValue) {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (event: any) => {
    form.submit();
  };

  const handleLocationSelect = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place?.geometry?.location) {
      const addressComponents = place?.address_components;

      let country = "";
      let city = "";

      addressComponents?.forEach((component) => {
        if (component.types.includes("country")) {
          country = component.long_name;
        }

        if (
          component.types.includes("administrative_area_level_1") ||
          component.types.includes("locality")
        ) {
          city = component.long_name;
        }
      });
      const locationData: Location = {
        name: place.name || "",
        lat: Number(place.geometry?.location?.lat().toFixed(6)),
        lng: Number(place.geometry?.location?.lng().toFixed(6)),
        city: city,
        country: country,
      };

      setLocations(locationData);

      console.log(locationData);
      setMapCenter({ lat: locationData.lat, lng: locationData.lng });
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    const { latLng } = e;
    const lat = latLng?.lat();
    const lng = latLng?.lng();
    let country = "";
    let city = "";

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${api_key}`
      );
      const { results } = response.data;
      let stopExecution = false;
      if (results.length > 0) {
        results.forEach((result: any) => {
          const address_components = result.address_components;

          address_components?.forEach(
            (component: google.maps.GeocoderAddressComponent) => {
              if (component.types.includes("country")) {
                country = component.long_name;
              }

              if (
                component.types.includes("administrative_area_level_1") ||
                component.types.includes("locality") ||
                component.types.includes("administrative_area_level_2")
              ) {
                city = component.long_name;
              }
            }
          );

          if (city && country) {
            stopExecution = true;
            return; // Stop the iteration
          }
        });

        const locationData: Location = {
          name: results[1].formatted_address,
          lat: Number(lat?.toFixed(6)),
          lng: Number(lng?.toFixed(6)),
          city: city,
          country: country,
        };
        console.log(locationData);

        setLocations(locationData);
        setMapCenter({ lat: locationData.lat, lng: locationData.lng });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (newValue: number) => {
    setRadius(newValue);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };

  const onDateRadioChange = (e: RadioChangeEvent) => {
    setSelectedDateOption(e.target.value);
  };
  const onRadioChangeEnd = (e: RadioChangeEvent) => {
    setSelectedOptionEnd(e.target.value);
  };

  const disabledDate = (currentDate: dayjs.Dayjs): boolean => {
    const today = dayjs();
    const isAfterToday = currentDate.isAfter(today);
    const isBeforeStartDate = currentDate.isBefore(
      dayjs(
        startDate?.add(2, dateFormatsForDisable[selectedOption]),
        dateFormats[selectedOption]
      )
    );

    return isAfterToday || isBeforeStartDate;
  };
  const validateInput = (rule: any, value: string) => {
    if (!/^[a-zA-Z]+$/.test(value)) {
      return Promise.reject("Only letters are allowed.");
    } else if (value !== undefined && value.length < 4) {
      return Promise.reject("Value must have at least 4 characters.");
    } else {
      return Promise.resolve("OK");
    }
  };

  return (
    <>
      <Form
        name="form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item label="Header">
          <Input value={header} onChange={(e) => setHeader(e.target.value)} />
        </Form.Item>

        <Form.Item label="Author's Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item label="City">
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </Form.Item>

        <Form.Item label="Country">
          <Input value={country} onChange={(e) => setCountry(e.target.value)} />
        </Form.Item>
        <Form.Item label="Label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="text"
          label="Text"
          rules={[{ validator: validateInput }]}
        >
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </Form.Item>
        
        <Form.Item> <Radio.Group
                options={decadeOption}
                onChange={onRadioChangeInput}
                value={selectedDateInput}
                optionType="button"
                buttonStyle="solid"
                style={{marginBottom:"10px"}}
              /></Form.Item>
            {selectedDateInput!=="date"&&  <Select
          value={selectedDecadeValue}
          onChange={(value: number) => {
            const decStartString = (value - 2).toString();
            const decEndString = (value + 8).toString();
            setStartDate(dayjs(decStartString.toString(), yearFormat));
            setEndDate(dayjs(decEndString.toString(), yearFormat));
            console.log(endtDate);
          }}
          options={decadeSelectOptions}
          placeholder="Select a decade."
          style={{ marginBottom: "30px" }}
        />}
        
       { selectedDateInput === "date"&& <Form.Item>
          <Form.Item>
            <Radio.Group
              options={searchDateOptions}
              onChange={onDateRadioChange}
              value={selectedDateOption}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item>
            <Select
              allowClear
              value={selectedSeason}
              onChange={(value) => setSelectedSeason(value)}
              options={seasonOptions}
              placeholder="Select a season."
            />
          </Form.Item>
          <Form.Item>
            <Col>
              <Radio.Group
                options={options}
                onChange={onRadioChange}
                value={selectedOption}
                optionType="button"
                buttonStyle="solid"
              />
              {selectedOption === "exact-year" && (
                <>
                  <DatePicker
                    placeholder="Select start date!"
                    status="error"
                    picker="date"
                    format={exactDateFormat}
                    onChange={(date) => {
                      if (selectedDateOption !== "interval") {
                        const start = dayjs(date, exactDateFormat);
                        const endDate = dayjs(date, exactDateFormat);
                        setStartDate(start.subtract(1, "day"));
                        setSelectedOptionEnd("exact-year");
                        setEndDate(endDate.add(1, "day"));
                      }
                      const start = dayjs(date, exactDateFormat);
                      setStartDate(start.subtract(1, "day"));
                    }}
                  />
                </>
              )}
              {selectedOption === "month" && (
                <DatePicker
                  status="error"
                  format={monthFormat}
                  picker="month"
                  placeholder="Select start date!"
                  onChange={(date) => {
                    if (selectedDateOption === "one_date") {
                      const start = dayjs(date, monthFormat);
                      const endDate = dayjs(date, monthFormat);
                      setStartDate(start.subtract(1, "month"));
                      setSelectedOptionEnd("month");
                      setEndDate(endDate.add(1, "month"));
                      console.log("burada");
                    }
                    const start = dayjs(date, monthFormat);
                    setStartDate(start.subtract(1, "month"));
                  }}
                />
              )}
              {selectedOption === "year" && (
                <DatePicker
                  placeholder="Select start date!"
                  status="error"
                  format={yearFormat}
                  picker="year"
                  onChange={(date) => {
                    if (selectedDateOption !== "interval") {
                      const start = dayjs(date, yearFormat);
                      const endDate = dayjs(date, yearFormat);
                      setStartDate(start.subtract(1, "year"));
                      setSelectedOptionEnd("year");
                      setEndDate(endDate.add(1, "year"));
                    }
                    const start = dayjs(date, yearFormat);
                    setStartDate(start.subtract(1, "year"));
                  }}
                />
              )}
            </Col>
          </Form.Item>
          {selectedDateOption === "interval" && (
            <Form.Item>
              <Select
                allowClear
                value={selectedSeasonEnd}
                onChange={(value) => setSelectedSeasonEnd(value)}
                options={seasonOptions}
                placeholder="Select a season."
              />
            </Form.Item>
          )}

          {selectedDateOption === "interval" && (
            <>
              <Form.Item>
                <Col>
                  <Radio.Group
                    options={options}
                    onChange={onRadioChangeEnd}
                    value={selectedOptionEnd}
                    optionType="button"
                    buttonStyle="solid"
                  />
                  {selectedOptionEnd === "exact-year" && (
                    <>
                      <DatePicker
                        placeholder="Select end date!"
                        picker="date"
                        disabledDate={disabledDate}
                        format={exactDateFormat}
                        onChange={(date) => {
                          const start = dayjs(date, exactDateFormat);
                          setEndDate(start.add(1, "day"));
                        }}
                      />
                    </>
                  )}
                  {selectedOptionEnd === "month" && (
                    <DatePicker
                      placeholder="Select end date!"
                      format={monthFormat}
                      disabledDate={disabledDate}
                      picker="month"
                      onChange={(date) => {
                        const start = dayjs(date, monthFormat);
                        setEndDate(start.add(1, "month"));
                      }}
                    />
                  )}
                  {selectedOptionEnd === "year" && (
                    <DatePicker
                      placeholder="Select end date!"
                      format={yearFormat}
                      picker="year"
                      disabledDate={disabledDate}
                      onChange={(date) => {
                        const start = dayjs(date, yearFormat);
                        setEndDate(start.add(1, "year"));
                      }}
                    />
                  )}
                </Col>
              </Form.Item>
            </>
          )}
        </Form.Item>}
        <Form.Item>
          <Row>
            <div className="form-group">
              <label>Locations:</label>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handleLocationSelect}
              >
                <input type="text" className="form-control" />
              </Autocomplete>

              {locations && (
                <div>
                  <li
                    style={{
                      display: "inline-block",
                      marginRight: "0.5em",
                      marginLeft: "0.5em",
                    }}
                  >
                    {locations.name || `${locations.lat}, ${locations.lng}`}
                  </li>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setLocations(undefined)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </Row>
        </Form.Item>
        <Form.Item>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={20}
            onClick={handleMapClick}
          >
            {locations && (
              <Marker position={{ lat: locations.lat, lng: locations.lng }} />
            )}
          </GoogleMap>
        </Form.Item>
        <Form.Item label="Radius (km)" name="radius">
          <Slider
            onChange={onChange}
            min={1}
            defaultValue={1}
            max={100}
            marks={{ 1: "1 km", 100: "100 km" }}
            tooltip={{ open: true }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Search!
          </Button>
        </Form.Item>
      </Form>
      {stories !== null && (
        <Container>
          <Row>
            <h2>Results</h2>
          </Row>
          <ul style={{ listStyle: "none", marginRight: "10px" }}>
            {stories
              ?.slice()
              .reverse()
              .map((story: StoryInt) => (
                <li key={story.id}>
                  <Story story={story} />
                </li>
              ))}
          </ul>
        </Container>
      )}
    </>
  );
};

const Search: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("story");
  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };
  return (
    <>
      <NavBar />
      <Radio.Group
        style={{ margin: "5px" }}
        options={searchOptions}
        onChange={onRadioChange}
        value={selectedOption}
        optionType="button"
        buttonStyle="solid"
      />
      {selectedOption === "user" ? <UserSearch /> : <StroySearch />}
    </>
  );
};

export default Search;
