/*global chrome*/
import React from "react";
import { Button, Segment, Icon } from 'semantic-ui-react'






const TimeStamp = ({time}) => {

    const handlePress = () => {
        chrome.runtime.sendMessage({ action: "jumpToTimestamp", seconds: time}, (response) => {
            console.log(response)
          });
    }

    return (

            <Button onClick={handlePress} animated color="blue">
                <Button.Content visible>{time}</Button.Content>
                <Button.Content hidden>
                    <Icon name='arrow right' />
                </Button.Content>
            </Button>
    )
}

export default TimeStamp;