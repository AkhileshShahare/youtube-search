import React from "react";
import "./App.css";
import { List } from "./containers/List";

export default function App() {
  return (
    <div className="content">
      <div className="container">
        <section className="section">
          <List />
        </section>
        <hr />
      </div>
    </div>
  );
}
