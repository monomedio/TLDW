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
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "id": "GxgqpCdOKak",
            "token": "good girl",
            "isExactMatch": true
            });

            var requestOptions = {
            method: 'POST',
            mode: "no-cors",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://6unmv3413l.execute-api.ca-central-1.amazonaws.com/Prod/hello", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        } catch(error){
            console.log(error)
        }
    }
    
    
    const attemp2 = async () => {
        const response = await axios.post("https://6unmv3413l.execute-api.ca-central-1.amazonaws.com/Prod/hello", 
           {mode: "no-cors", body:
           {
            "id": "GxgqpCdOKak",
            "token": "good girl",
            "isExactMatch": true
            }})
            console.log(response.data)
        }
    attemp2()

}


const SummaryButton = () => {
    return (
        <><AwesomeButton type="primary" onPress={handlePress} >Summarize</AwesomeButton></>
    )
}

export default SummaryButton;