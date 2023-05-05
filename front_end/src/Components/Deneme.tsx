import { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, TabPane } from "react-bootstrap";
import { Card, DatePicker, Form, Radio, Tabs } from "antd";
import ReactQuill from "react-quill";

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const Deneme: React.FC = () => {
  const token = localStorage.getItem("jwt_Token");
  const nav = useNavigate();
  const [imgs, setImgs] = useState<string | undefined>();
  const [form] = Form.useForm();
  const [isMe, setIsMe] = useState<boolean>(true);
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt_Token"))
      ?.split("=")[1];

    if (!cookieValue) {
      nav("/login");
    }
  }, []);

  const handleChnage = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    const data = new FileReader();
    data.addEventListener("load", () => {
      setImgs(data.result as string);
    });
    data.readAsDataURL(e.target.files![0]);
  };
  const navigate = useNavigate();
  function handleClick() {
    navigate("/register", { replace: true });
  }
  const [editorContent, setEditorContent] = useState("");
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    console.log(content);
  };
  const [selectedOption, setSelectedOption] = useState<string>("option1");

  const onChange = (e: any) => {
    setSelectedOption(e.target.value);
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

  console.log(imgs);
  return (
    <div>
      <Container>
        <Form form={form}></Form>
      </Container>
      {isMe && <p>Merhaba</p>}

      <Container>
        <Row>
          <Col>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              formats={formats}
              modules={modules}
            />
          </Col>
          <Col xs={6}>2 of 3 (wider)</Col>
          <Col>3 of 3</Col>
        </Row>
        <Row>
          <Col>1 of 3</Col>
          <Col xs={5}>2 of 3 (wider)</Col>
          <Col>
            <button onClick={() => {}}>Basdir</button>
          </Col>
        </Row>
      </Container>
      <Container>
        return (
        <Card>
          <Tabs>
            <Tabs.TabPane tab="Tab 1" key="1">
              <DatePicker />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Tab 2" key="2"></Tabs.TabPane>
          </Tabs>
        </Card>
        );
      </Container>
      <Container>
        <div>
          <Radio.Group
            options={options}
            onChange={onChange}
            value={selectedOption}
          />
          <p>You selected: {selectedOption}</p>
        </div>
      </Container>
    </div>
  );
};

export default Deneme;
