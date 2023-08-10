/*global chrome*/
import React from "react";
import { Button, Segment, Icon } from 'semantic-ui-react'






const TimeStamp = ({time}) => {

    const handlePress = () => {
        chrome.runtime.sendMessage({ action: "jumpToTimestamp", seconds: time}, (response) => {
            console.log(response)
          });
    }

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

    return (

            <Button onClick={handlePress} animated color="blue">
                <Button.Content visible>{convertToHoursMinutesSeconds(time)}</Button.Content>
                <Button.Content hidden>
                    <Icon name='arrow right' />
                </Button.Content>
            </Button>
    )
}

export default TimeStamp;