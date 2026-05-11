import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePoll.css";

function CreatePoll() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  const [form,setForm]= useState(
    {
      title:"",
      description: "",
      requiresAuth: Boolean,
      expiresAt:0,
      questions:[
        {
          question:"",
          options:[
            {text:""},
            {text:""}
          ],
          isRequired:false

        }
      ]
    }
  )

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
  return ( 
    <div>
      <form onSubmit={}></form>
    </div>
  )
}