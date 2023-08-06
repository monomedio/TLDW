     /*global chrome*/
import React from "react";
import 'react-awesome-button/dist/styles.css';
import axios from "axios"
import {
    AwesomeButton,
    AwesomeButtonProgress,
    AwesomeButtonSocial,
  } from 'react-awesome-button';


function getCurrentTabUrl(callback) {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    callback(url);
});
}


const handlePress = () => {

    const fetchData = async () => {
        const response = await axios.post("https://6unmv3413l.execute-api.ca-central-1.amazonaws.com/Prod/hello", 
           {mode: "no-cors", body:
           {
            "id": "GxgqpCdOKak",
            "token": "good girl",
            "isExactMatch": true
            }})
            console.log(response.data.body)
        }
    fetchData()

}


const SummaryButton = () => {
    return (
        <><AwesomeButton type="primary" onPress={handlePress} >Summarize Video</AwesomeButton></>
    )
}

export default SummaryButton;