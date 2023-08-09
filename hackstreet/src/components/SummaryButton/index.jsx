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




const SummaryButton = ({handlePress}) => {
    return (
        <><AwesomeButton type="primary" onPress={handlePress} >Summarize Video</AwesomeButton></>
    )
}

export default SummaryButton;