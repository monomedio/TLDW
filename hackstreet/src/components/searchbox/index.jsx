/*global chrome*/
import React, { useState } from "react";
import { MDBCol, MDBIcon } from "mdb-react-ui-kit";
import axios from "axios";

const SearchBox = ({ onClick, searchTerm, checkboxValue, onSearchTermChange, onCheckboxChange }) => {

    const handleSearchTermChange = (event) => {
        onSearchTermChange(event.target.value); // Update the parent state
      };
    
      const handleCheckboxChange = (event) => {
        console.log("event", event.target.checked)
        onCheckboxChange(event.target.checked); // Update the parent state
      };



  return (
    <MDBCol md="6">
      <form>
        <div className="input-group md-form form-sm form-1 pl-0">
          <input
            className="form-control my-0 py-1"
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Search"
            aria-label="Search"
          />
          <div className="input-group-prepend">
            <button
              type="button"
              onClick={onClick}
              className="input-group-text purple darken-3"
              id="basic-text1"
            >
              <MDBIcon className="text-green" icon="search" />
            </button>
          </div>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={checkboxValue}
            onChange={handleCheckboxChange}
            id="checkboxId"
          />
          <label className="form-check-label" htmlFor="checkboxId">
            Match exact text
          </label>
        </div>
      </form>
    </MDBCol>
  );
};

export default SearchBox;
