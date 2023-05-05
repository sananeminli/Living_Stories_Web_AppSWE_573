import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";

import axios from "axios";
import { Params, useNavigate, useParams } from "react-router-dom";
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
interface RouteParams extends Params {
  id: string;
}

const exactDateFormat = "DD/MM/YYYY";
const yearFormat = "YYYY";
const monthFormat = "MM/YYYY";

const Story: React.FC = () => {
  const { id } = useParams<RouteParams>();

  useEffect(() => {
    // Fetch story data from API using the ID parameter
    const fetchStory = async () => {
      const response = await axios.get(`http://localhost:8080/stories/${id}`, {
        withCredentials: true,
      });
      setLabels(response.data.labels);
      setHeader(response.data.header)
      setEditorContent(response.data.richText)

    };

    fetchStory();
  }, [id]);
 
  
  const [header, setHeader] = useState<string>("");
  
  const [labels, setLabels] = useState<string[]>([]);

  const [editorContent, setEditorContent] = useState("");
 
 

  const navigate = useNavigate();

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };
  


  const handleSubmit = () => {
    const editRequest: any = {
      header,
      labels,
      richText: editorContent,
    };
    async function postData() {
      try {
        console.log(editRequest);
        const response = await axios.post(
          `http://localhost:8080/stories/edit/${id}`,
          editRequest,
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
        
          </Container>


      <Container>
        <Row>
          <Col sm = {12}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              formats={formats}
              modules={modules}
            />
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
