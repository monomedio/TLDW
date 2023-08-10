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
    const [tabUrl, setTabUrl] = useState("")
    const [summary, setSummary] = useState("")

    
    
    function getYouTubeVideoID(url) {
        const videoIDMatch = url.match(/v=([^&]+)/);
        return videoIDMatch ? videoIDMatch[1] : null;
    }
    
    
    const getUrl = () => {
        chrome.runtime.sendMessage({ action: "getTabInfo" }, (response) => {
            
            if (response) {
                console.log("here")
                setTabUrl(getYouTubeVideoID(response)); // Update the tab URL state
                console.log(tabUrl)
            }
        });
    }
    
    useEffect(() => {
        getUrl()
    }, [])


    const handleClickSearch = () => {
        const fetchData = async () => {
            console.log(searchTerm)
            getUrl()

            const response = await axios.post("https://6unmv3413l.execute-api.ca-central-1.amazonaws.com/Prod/hello", 
            {mode: "no-cors", body:
            {
                "id": tabUrl,
                "token": searchTerm,
                "isExactMatch": checkboxValue
            }})
            setTimes(response.data.body.dict[searchTerm])
            console.log(times)
            setSummary("")
            
        }
        fetchData()
    }

    const handleClickSummary = () => {
        const fetchData = async () => {
            getUrl()
            const response = await axios.post("https://6unmv3413l.execute-api.ca-central-1.amazonaws.com/Prod/hello", 
            {mode: "no-cors", body:
            {
                "id": tabUrl,
                "token": "",
                "isExactMatch": false
            }})
            console.log(response.data.body.transcript)
            setSummary(response.data.body.transcript)
            setTimes("")
            
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
            <SummaryButton handlePress={handleClickSummary}/>
        </div>
    </div>
    <div className="col">
        {!summary ? (Array.isArray(times) ? (
          times.map((time, index) => (
            <TimeStamp key={index} time={time} /> 
          ))
        ) : (<h1>nothing found</h1>)) 
        : summary

    }
    </div>
    </div>
  );
}
export default MainPage;
