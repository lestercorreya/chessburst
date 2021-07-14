import React, { useState } from "react";
import { useBeforeunload } from "react-beforeunload";

function Trial() {
  const [value, setValue] = useState("");

  useBeforeunload((event) => {
    const url = window.location.href;
    if (url === "http://localhost:3000/") {
      fetch("http://localhost:5000/user/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_id: window.location.href,
          username: "sdfjsdklf",
          profilePic: "sdfksjdfl",
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    }
  });

  return (
    <input onChange={(event) => setValue(event.target.value)} value={value} />
  );
}

export default Trial;
