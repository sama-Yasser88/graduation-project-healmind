import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'
import App from './App.jsx'

// Initialize mock doctor token for testing/integration
const TEST_DOCTOR_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmY3MWQ0NjVkZGZlMTYyM2MzNGY0NyIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3ODYyODg5ODcsImV4cCI6MTc4NjM3NTM4N30.UmvSHvrQ20rAWhqPguN37XgQGEMfqm-n3mXUbBu9YgA";

if (!localStorage.getItem("token")) {
  localStorage.setItem("token", TEST_DOCTOR_TOKEN);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


