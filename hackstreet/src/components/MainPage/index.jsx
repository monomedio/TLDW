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
            console.log(response)
            let timestamps = []
            var terms = [searchTerm]
            let otherTerms = searchTerm.split(" ")
            for (let i = 0; i < otherTerms.length; i++){
                terms.push(otherTerms[i])
            }
            console.log(terms)
            for (let j = 0; j < terms.length; j++){
                console.log(terms[j])
                let word = terms[j]
                if (response.data.body.dict[word]) {
                    for (let f = 0; f < response.data.body.dict[word].length; f++){
                        timestamps.push(response.data.body.dict[word][f])
                    }
                }
            }
            console.log(timestamps)
            setTimes(timestamps)
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
            let transcript = response.data.body.transcript

            const response2 = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: { Authorization: `Bearer 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` },
                    method: "POST",
                    body: JSON.stringify(transcript),
                }
            );
            const result = await response2.json();
            console.log(result[0]["summary_text"])
            setSummary(result[0]["summary_text"])
            console.log(summary)
            setTimes("")
            
        }
        fetchData()
    }

    return (
        <div className="container" style={{ width: '500px', height: '400px' }}>
          <div className="row mb-4"> {/* Remove align-items-center */}
            <div className="col-6">
              <SearchBox
                onClick={handleClickSearch}
                searchTerm={searchTerm}
                checkboxValue={checkboxValue}
                onSearchTermChange={setSearchTerm}
                onCheckboxChange={setCheckboxValue}
              />
            </div>
            <div className="col-6 d-flex justify-content-center">
              <SummaryButton handlePress={handleClickSummary} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              {!summary ? (
                Array.isArray(times) ? (
                  <div className="d-flex flex-row flex-wrap justify-content-start align-items-center">
                    {times.map((time, index) => (
                      <div key={index} className="mr-2 mb-2">
                        <TimeStamp time={time} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <h1 className="text-center">nothing found</h1>
                )
              ) : (
                <div className="text-center">{summary}</div>
              )}
            </div>
          </div>
        </div>
      );
      

}
export default MainPage;
