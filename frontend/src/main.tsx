import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import App from "./App"
import NewEnvelopePage from "./pages/NewEnvelopePage"
import ViewEnvelopePage from "./pages/ViewEnvelopePage"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<NewEnvelopePage />} />
        <Route path="/envelopes/:envNo" element={<ViewEnvelopePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
