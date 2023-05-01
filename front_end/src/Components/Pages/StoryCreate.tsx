import React, { useState, useRef, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";

import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Col, Row, Container } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import dayjs from "dayjs";
import { RadioGroup } from "../Components/DateRadio";
import DatePicker from "antd/es/date-picker";

const urlEndpoint = "http://localhost:8080/stories";
const api_key = import.meta.env.VITE_GOOGLE_API_KEY;
const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface Story {
  text: string;
  header: string;
  labels: string[];
  locations: Location[];
  mediaString: string[];
  richText: string;
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [text, setText] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endtDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [editorContent, setEditorContent] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("exact-year");
  const [selectedOptionEnd, setSelectedOptionEnd] =
    useState<string>("exact-year");
  const onRadioChange = (value: string) => {
    setSelectedOption(value);
  };
  const onRadioChangeEnd = (value: string) => {
    setSelectedOptionEnd(value);
  };

  const navigate = useNavigate();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };
  const handleLocationSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const locationData: Location = {
        name: place.name || "",
        lat: Number(place.geometry?.location?.lat().toFixed(6)),
        lng: Number(place.geometry?.location?.lng().toFixed(6)),
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
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${api_key}`
      );
      const { results } = response.data;
      if (results.length > 0) {
        const locationData: Location = {
          name: results[0].formatted_address,
          lat: Number(lat?.toFixed(6)),
          lng: Number(lng?.toFixed(6)),
        };
        setLocations([...locations, locationData]);
        setMapCenter({ lat: locationData.lat, lng: locationData.lng });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    const storyRequest: Story = {
      text,
      header,
      labels,
      locations,
      mediaString: media,
      richText: editorContent,
    };
    async function postData() {
      try {
        console.log(storyRequest);
        const response = await axios.post(
          "http://localhost:8080/stories",
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
  return (
    <>
      <NavBar />
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
          <RadioGroup
            options={options}
            onChange={onRadioChange}
            value={selectedOption}
          />
          {selectedOption === "exact-year" && (
            <DatePicker
            placeholder="Select start date!"
              status="error"
              picker="date"
              format={exactDateFormat}
              onChange={(date) => {
                const start = dayjs(date, exactDateFormat);
                setStartDate(start);
                console.log(startDate?.toString);
                // Do something with the selected date value here
              }}
            />
          )}
          {selectedOption === "month" && (
            <DatePicker
              status="error"
              format={monthFormat}
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
              <RadioGroup
                options={options}
                onChange={onRadioChangeEnd}
                value={selectedOptionEnd}
              />
              {selectedOptionEnd === "exact-year" && (
                <DatePicker
                placeholder="Select end date!"
                  picker="date"
                  format={exactDateFormat}
                  onChange={(date) => {
                    const start = dayjs(date, exactDateFormat);
                    setEndDate(start);
                    console.log(startDate?.toString);
                    // Do something with the selected date value here
                  }}
                />
              )}
              {selectedOptionEnd === "month" && (
                <DatePicker
                placeholder="Select end date!"
                  format={monthFormat}
                  picker="month"
                  onChange={(date) => {
                    const start = dayjs(date, monthFormat);
                    setEndDate(start);
                    console.log(startDate?.toString);
                    // Do something with the selected date value here
                  }}
                />
              )}
              {selectedOptionEnd === "year" && (
                <DatePicker
                  placeholder="Select end date!"
                  format={yearFormat}
                  picker="year"
                  onChange={(date) => {
                    const start = dayjs(date, yearFormat);
                    setEndDate(start);
                    console.log(startDate?.toString);
                    // Do something with the selected date value here
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
                <ul style={{ display: "flex", flexDirection: "row" }}>
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
