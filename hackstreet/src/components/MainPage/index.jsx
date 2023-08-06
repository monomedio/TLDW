/* global chrome */

import React, {useEffect, useState} from 'react';
import SearchBox from '../SearchBox';
import SummaryButton from '../SummaryButton';
import TimeStamp from '../TimeStamp';
import axios from "axios"
import "../../content"
import "../../background"



function MainPage() {
    const [times, setTimes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [checkboxValue, setCheckboxValue] = useState(false); // State for checkbox value
    const[tabUrl, setTabUrl] = useState("")

    useEffect(() => {
        console.log(times)
    }, [times])


    function convertToHoursMinutesSeconds(timestamp) {
        const hours = Math.floor(timestamp / 3600);
        const minutes = Math.floor((timestamp % 3600) / 60);
        const seconds = Math.floor(timestamp % 60);
    
        if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    const getUrl = () => {
        chrome.runtime.sendMessage({ action: "getTabInfo" }, (response) => {
            console.log("over here")
            if (response) {
              console.log(tabUrl)
              console.log("here")
              setTabUrl(response.tabUrl); // Update the tab URL state
            }
          });
    }

    const handleClickSearch = () => {
        const fetchData = async () => {
            console.log(searchTerm)
            getUrl()

            const response = await axios.post("https://6unmv3413l.execute-api.ca-central-1.amazonaws.com/Prod/hello", 
            {mode: "no-cors", body:
            {
                "id": "GxgqpCdOKak",
                "token": searchTerm,
                "isExactMatch": checkboxValue
            }})
            console.log(response.data.body[searchTerm])
            setTimes(response.data.body[searchTerm])
            
        }
        fetchData()
    }

    const handleClickSummary = () => {
        const fetchData = async () => {
            console.log(searchTerm)
            const response = await axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", 
            {mode: "no-cors", body:
            {
                "id": "GxgqpCdOKak",
                "token": searchTerm,
                "isExactMatch": checkboxValue
            }})
            console.log(response.data.body[searchTerm])
            setTimes(response.data.body[searchTerm])
            
        }
        fetchData()
    }

    return (
    <div className="container">
    <div className="row">
        <div className="col">
        <SearchBox
            onClick={handleClickSearch}
            searchTerm={searchTerm} // Pass searchTerm as prop
            checkboxValue={checkboxValue} // Pass checkboxValue as prop
            onSearchTermChange={setSearchTerm} // Callback for updating searchTerm
            onCheckboxChange={setCheckboxValue} // Callback for updating checkboxValue
          />
        </div>
        <div className="col">
            <SummaryButton/>
        </div>
    </div>
    <div className="col">
    {Array.isArray(times) ? (
          times.map((time, index) => (
            <TimeStamp key={index} time={convertToHoursMinutesSeconds(time)} /> 
          ))
        ) : (
          <h1>wro</h1>
        )}
    </div>
    </div>
  );
}
export default MainPage;
