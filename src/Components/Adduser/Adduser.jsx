import axios from "axios";
import { useState } from "react";

function App() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");

  const submitUser = async () => {
    await axios.post("http://localhost:5000/addUser",{
      name,
      email
    });
    alert("User Added");
  };

  return (
    <>
      <input 
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <button onClick={submitUser}>
        Add User
      </button>
    </>
  );
}

export default App;