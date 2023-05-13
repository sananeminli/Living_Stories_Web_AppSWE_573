import { Button, Input, Radio, RadioChangeEvent } from "antd";
import axios from "axios";
import { useState } from "react";
import { Container, Nav, Row } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";

type Option = {
  label: string;
  value: string;
};

interface SearchRequest {
  name?: string;
  header?: string;
  startDate?: string;
  endDate?: string;
}
interface UserSearchResult {
  name: string;
  id: number;
}

const options: Option[] = [
  { label: "User", value: "user" },
  { label: "Story", value: "story" },
];

const UserSearch: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleSubmit = async (event: any) => {
    const searchData: SearchRequest = {
      name,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/users/findusers",
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

const Search: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("user");
  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };
  return (
    <>
      <NavBar />
      <Radio.Group
        style={{ margin: "5px" }}
        options={options}
        onChange={onRadioChange}
        value={selectedOption}
        optionType="button"
        buttonStyle="solid"
      />
      {selectedOption === "user" ? (
        <UserSearch />
      ) : (
        <p> Story search will be here! </p>
      )}
    </>
  );
};

export default Search;
