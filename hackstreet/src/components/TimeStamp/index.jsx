/*global chrome*/
import React from "react";
import { Button, Segment } from 'semantic-ui-react'




const handlePress = () => {


}


const TimeStamp = ({time}) => {
    return (

            <Button animated color="blue">
                <Button.Content visible>{time}</Button.Content>
                <Button.Content hidden>hello</Button.Content>
            </Button>
    )
}

export default TimeStamp;