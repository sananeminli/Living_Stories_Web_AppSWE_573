import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";

import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Col, Row, Container } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import dayjs from "dayjs";
import { RadioGroup } from "../Components/DateRadio";
import DatePicker from "antd/es/date-picker";
import { Radio, RadioChangeEvent, Select, TimePicker } from "antd";
import type { Dayjs } from "dayjs";

const urlEndpoint = `${import.meta.env.VITE_BACKEND_URL}/stories`;
const api_key = import.meta.env.VITE_GOOGLE_API_KEY;
const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Location {
  name: string;
  lat: number;
  lng: number;
  city?:string;
  country?:string;
}

interface Story {
  text: string;
  header: string;
  labels: string[];
  locations: Location[];
  mediaString: string[];
  richText: string;
  startDate?: string;
  endDate?: string;
  startSeason?: string;
  endSeason?:string;
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

const Story: React.FC = () => {
  
  
 

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 41.0856396,
    lng: 29.0424937,
  });
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>();
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>();
  const [locations, setLocations] = useState<Location[]>([]);
  const [text, setText] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endtDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [editorContent, setEditorContent] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("exact-year");
  const [selectedSeason, setSelectedSeason] = useState<string>();
  const [selectedSeasonEnd, setSelectedSeasonEnd] = useState<string>();
  const [requestStartDate, setRequestStartDate] = useState<string>();
  const [selectedOptionEnd, setSelectedOptionEnd] = useState<string>("exact-year");
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
  const combinedStartDateTimeString = `${
    startDate && startTime&& selectedOption==='exact-year'
      ? dayjs(
          `${startDate.format("YYYY-MM-DD")}T${startTime.format("HH:mm:ss")}`
        ).format("DD/MM/YYYY HH:mm:ss")
      : startDate?.format(dateFormats[selectedOption])
  }`;

  const combinedEndDateTimeString = `${
    endtDate && endTime && selectedOptionEnd === "exact-year" 
      ? dayjs(
          `${endtDate.format("YYYY-MM-DD")}T${endTime.format("HH:mm:ss")}`
        ).format("DD/MM/YYYY HH:mm:ss")
      : endtDate?.format(dateFormats[selectedOptionEnd])
  }`;
  

 
  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };
  const onRadioChangeEnd = (e: RadioChangeEvent) => {
    setSelectedOptionEnd(e.target.value);
  };

  const navigate = useNavigate();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
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
        city:city,
        country:country
      };
      

      setLocations([...locations, locationData]);
      
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
        results.forEach((result:any) => {
          const address_components = result.address_components;
          console.log(address_components)
         
          address_components?.forEach((component:google.maps.GeocoderAddressComponent) => {
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
          });
        
          if (city && country) {
            stopExecution = true;
            return; // Stop the iteration
          }
        });
        
        
       

        const locationData: Location = {
          name: results[1].formatted_address,
          lat: Number(lat?.toFixed(6)),
          lng: Number(lng?.toFixed(6)),
          city:city,
          country:country
        };
       console.log(locationData)
       
        
        setLocations([...locations, locationData]);
        setMapCenter({ lat: locationData.lat, lng: locationData.lng });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disabledDate = (currentDate: dayjs.Dayjs): boolean => {
    const today = dayjs();
    const isAfterToday = currentDate.isAfter(today);
    const isBeforeStartDate = currentDate.isBefore(
      dayjs(startDate, dateFormats[selectedOption])
    );

    return isAfterToday || isBeforeStartDate;
  };

  const disableStartdDate = (currentDate: dayjs.Dayjs): boolean => {
    const today = dayjs();
    const isAfterToday = currentDate.isAfter(today);
    

    return isAfterToday ;
  };

  const handleStartTimeChange = (time: Dayjs | null, timeString: string) => {
    setStartTime(time);
    console.log(time?.format("HH:mm:ss"));
  };
  const handleEndTimeChange = (time: Dayjs | null, timeString: string) => {
    setEndTime(time);
    console.log(time?.format("HH:mm:ss"));
  };

  const handleSubmit = () => {
    const storyRequest: Story = {
      text,
      header,
      labels,
      locations,
      mediaString: media,
      richText: editorContent,
      ...(startDate && { startDate: combinedStartDateTimeString }),
      ...(endtDate && { endDate: combinedEndDateTimeString }),
      ...(selectedSeason && { startSeason: selectedSeason }),
      ...(selectedSeasonEnd && { endSeason: selectedSeasonEnd })
    };
    async function postData() {
      try {
        console.log(storyRequest);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/stories`,
          storyRequest,
          {
            withCredentials: true,
          }
        );

        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    postData();
    navigate("/home");
  };

  const handleHeaderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHeader(event.target.value);
  };

  const handleLabelsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLabels(event.target.value.split(",").map((label) => label.trim()));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt_Token"))
      ?.split("=")[1];

    if (!cookieValue) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <NavBar />
      {startDate && <div>Combined DateTime: {combinedStartDateTimeString}</div>}
      {endtDate && <div>Combined End DateTime: {combinedEndDateTimeString}</div>}
      <Container>
        <Row>
          <Col>
            <form>
              <div className="form-group">
                <label>Header:</label>
                <input
                  type="text"
                  className="form-control"
                  value={header}
                  onChange={handleHeaderChange}
                />
              </div>

              <div className="form-group">
                <label>Labels (comma-separated):</label>
                <input
                  type="text"
                  className="form-control"
                  value={labels.join(", ")}
                  onChange={handleLabelsChange}
                />
              </div>
              <ul style={{ display: "flex", flexDirection: "row" }}>
                {labels.map((value, index) => (
                  <div key={index}>
                    <li
                      style={{
                        display: "inline-block",
                        marginRight: "0.5em",
                        marginLeft: "0.5em",
                      }}
                    >
                      {value}
                    </li>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setLabels(labels.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </ul>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Select
                value={selectedSeason}
                onChange={(value) => setSelectedSeason(value)}
                options={seasonOptions}
                placeholder="Select a season."
              />

              <Radio.Group
                options={options}
                onChange={onRadioChange}
                value={selectedOption}
                optionType="button"
                buttonStyle="solid"
              />
              {selectedOption === "exact-year" && (
                <>
                  <TimePicker
                    onChange={handleStartTimeChange}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  />
                  <DatePicker
                    placeholder="Select start date!"
                    status="error"
                    picker="date"
                    disabledDate = {disableStartdDate}
                    format={exactDateFormat}
                    onChange={(date) => {
                      const start = dayjs(date, exactDateFormat);
                      setStartDate(start);
                      console.log(start.format(exactDateFormat));
                    }}
                  />
                </>
              )}
              {selectedOption === "month" && (
                <DatePicker
                  status="error"
                  format={monthFormat}
                  disabledDate = {disableStartdDate}
                  picker="month"
                  placeholder="Select start date!"
                  onChange={(date) => {
                    const start = dayjs(date, monthFormat);
                    setStartDate(start);

                    console.log(startDate?.toString);
                    // Do something with the selected date value here
                  }}
                />
              )}
              {selectedOption === "year" && (
                <DatePicker
                  placeholder="Select start date!"
                  status="error"
                  format={yearFormat}
                  disabledDate = {disableStartdDate}
                  picker="year"
                  onChange={(date) => {
                    const start = dayjs(date, yearFormat);
                    setStartDate(start);
                    console.log(startDate?.toString);
                    // Do something with the selected date value here
                  }}
                />
              )}
            </Row>
          </Col>
          <Col>
            <Row>
              <Select
                value={selectedSeasonEnd}
                onChange={(value) => setSelectedSeasonEnd(value)}
                options={seasonOptions}
                placeholder="Select a season."
              />
              <Radio.Group
                options={options}
                onChange={onRadioChangeEnd}
                value={selectedOptionEnd}
                optionType="button"
                buttonStyle="solid"
              />
              {selectedOptionEnd === "exact-year" && (
                <>
                  <TimePicker
                    onChange={handleEndTimeChange}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  />
                  <DatePicker
                    placeholder="Select end date!"
                    picker="date"
                    disabledDate={disabledDate}
                    format={exactDateFormat}
                    onChange={(date) => {
                      const start = dayjs(date, exactDateFormat);
                      setEndDate(start);
                     
                      
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
                    setEndDate(start);
                    
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
                    setEndDate(start);
                    
                  }}
                />
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col sm={8}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              formats={formats}
              modules={modules}
            />
          </Col>
          <Col sm={4}>
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
                <ul >
                  {locations.map((loc, index) => (
                    <div key={index}>
                      <li
                        style={{
                          display: "inline-block",
                          marginRight: "0.5em",
                          marginLeft: "0.5em",
                        }}
                      >
                        {loc.name || `${loc.lat}, ${loc.lng}`}
                      </li>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          setLocations(locations.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </ul>
              </div>
            </Row>

            <Row>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={20}
                onClick={handleMapClick}
              >
                {locations.map((loc, index) => (
                  <Marker
                    key={index}
                    position={{ lat: loc.lat, lng: loc.lng }}
                  />
                ))}
              </GoogleMap>
            </Row>
          </Col>
        </Row>
      </Container>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
};

export default Story;
