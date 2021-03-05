import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
<<<<<<< HEAD
import { checkZoomRoomLink, checkFilled } from "main/utils/OfficeHoursFormHelpers";


const OfficeHourForm = ({ createOfficeHour, /*updateOfficeHour, /*existingOfficeHour*/ }) => {
    const idRef = useRef(null);
=======
import { checkTime, checkFilled } from "main/utils/OfficeHourFormHelpers";

const OfficeHourForm = ({ createOfficeHour, /*updateOfficeHour, /*existingOfficeHour*/ }) => {
    const tutorAssignmentIDRef = useRef(null);
>>>>>>> 677c8bd8951a5ec4b2096297deab462f1bc3be93
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);
    const dayOfWeekRef = useRef(null);
    const zoomRoomLinkRef = useRef(null);
<<<<<<< HEAD
=======
    const notesRef = useRef(null);
>>>>>>> 677c8bd8951a5ec4b2096297deab462f1bc3be93
    const emptyOfficeHour = {
        id: "",
        tutorAssignment: {
            id: ""
        },
        startTime: "",
        endTime: "",
        dayOfWeek: "",
        zoomRoomLink: "",
        notes: ""
    }

    const [officeHour, setOfficeHour] = useState(emptyOfficeHour);

    const handleOnSubmit = (e) => {
        e.preventDefault();
<<<<<<< HEAD

        var isValid = checkInputs();

        createOfficeHour(officeHour);

=======
        var isValid = checkInputs(); 
        if (isValid) {
            createOfficeHour(officeHour);
        }
>>>>>>> 677c8bd8951a5ec4b2096297deab462f1bc3be93
      
    }

    function checkInputs() {
        const validList = [];
<<<<<<< HEAD
        //check officehour name
        const idValid = checkFilled(officeHour.id);
        addFormEffects(idRef, idValid);
        validList.push(idValid);

        //check start time
        const startTimeValid = checkFilled(officeHour.startTime);
        addFormEffects(startTimeRef, startTimeValid);
        validList.push(startTimeValid);

        //check end time
        const endTimeValid = checkFilled(officeHour.endTime);
        addFormEffects(endTimeRef, endTimeValid);
        validList.push(endTimeValid);

        //check day of week
        const dayOfWeekValid = checkFilled(officeHour.dayOfWeek);
        addFormEffects(dayOfWeekRef, dayOfWeekValid);
        validList.push(dayOfWeekValid);

        //check zoom room Link
        const zoomRoomLinkValid = checkZoomRoomLink(officeHour.zoomRoomLink);
        addFormEffects(zoomRoomLinkRef, zoomRoomLinkValid);
        validList.push(zoomRoomLinkValid);

        return !validList.includes(false);
=======
        // check tutor assignment ID
        const tutorAssignmentIDValid = checkFilled(officeHour.tutorAssignment.id);
        addFormEffects(tutorAssignmentIDRef, tutorAssignmentIDValid);
        validList.push(tutorAssignmentIDValid); 

        // check start time 
        const startTimeValid = checkTime(officeHour.startTime);
        addFormEffects(startTimeRef, startTimeValid);
        validList.push(startTimeValid); 

        // check end time
        const endTimeValid = checkTime(officeHour.endTime);
        addFormEffects(endTimeRef, endTimeValid);
        validList.push(endTimeValid); 

        // check day of week
        const dayOfWeekValid = checkFilled(officeHour.dayOfWeek);
        addFormEffects(dayOfWeekRef, dayOfWeekValid);
        validList.push(dayOfWeekValid); 

        // check zoom room link
        const zoomRoomLinkValid = checkFilled(officeHour.zoomRoomLink);
        addFormEffects(zoomRoomLinkRef, zoomRoomLinkValid);
        validList.push(zoomRoomLinkValid); 

        return !validList.includes(false); 
>>>>>>> 677c8bd8951a5ec4b2096297deab462f1bc3be93
    }

    function addFormEffects(ref, isValid) {
        if (isValid) {
            ref.current.classList.add('is-valid');
            ref.current.classList.remove('is-invalid');
        }
        else {
            ref.current.classList.remove('is-valid');
            ref.current.classList.add('is-invalid');
        }
    }

    return (
        <Form onSubmit={handleOnSubmit}>
            <Form.Group as={Row} controlId="tutorAssignmentId">
                <Form.Label column sm={2}>
                    Tutor Assignment ID
                </Form.Label>
                <Col sm={10}>
                    <Form.Control ref={tutorAssignmentIDRef} type="text" placeholder="Ex: 1" value={officeHour.tutorAssignment.id} onChange={(e) => setOfficeHour({
                        ...officeHour,
                        tutorAssignment: {
                            id: e.target.value
                        }
                    })} />
                    <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please provide a valid tutor assignment ID.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Enter the tutor assignment ID where you can find under "Tutor Assignment" tab. Ex: 1</Form.Text>
                </Col>
            </Form.Group>
          <Form.Group as={Row} controlId="startTime">
                <Form.Label column sm={2}>
                    Start Time
                </Form.Label>
                <Col sm={10}>
                    <Form.Control ref={startTimeRef} type="text" placeholder="Ex: 12:00PM" value={officeHour.startTime} onChange={(e) => setOfficeHour({
                        ...officeHour,
                        startTime: e.target.value
                    })} />
                    <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please provide a valid start time in the correct format.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Enter the start time in standard format. Ex (XX:XXAM/PM): 1:00PM, 4:00AM, 10:00PM</Form.Text>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="endTime">
                <Form.Label column sm={2}>
                    End Time
                </Form.Label>
                <Col sm={10}>
                    <Form.Control ref={endTimeRef} type="text" placeholder="Ex: 1:00PM" value={officeHour.endTime} onChange={(e) => setOfficeHour({
                        ...officeHour,
                        endTime: e.target.value
                    })} />
                    <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please provide a valid end time in the correct format.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Enter the end time in standard format. Ex (XX:XXAM/PM): 1:00PM, 4:00AM, 10:00PM</Form.Text>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="dayOfWeek">
                <Form.Label column sm={2}>
                    Day of Week
                </Form.Label>
                <Col sm={10}>
                    <Form.Control ref={dayOfWeekRef} type="text" placeholder="Ex: M" value={officeHour.dayOfWeek} onChange={(e) => setOfficeHour({
                        ...officeHour,
                        dayOfWeek: e.target.value
                    })} />
                    <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please enter a valid day of week.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Enter the day of week in 1-letter shorthand. Ex: M</Form.Text>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="zoomRoomLink">
                <Form.Label column sm={2}>
                    Zoom Room Link
                </Form.Label>
                <Col sm={10}>
                    <Form.Control ref={zoomRoomLinkRef} type="text" placeholder="Ex: https://ucsb.zoom.us/j/XXXXXXXXX" value={officeHour.zoomRoomLink} onChange={(e) => setOfficeHour({
                        ...officeHour,
                        zoomRoomLink: e.target.value
                    })} />
<<<<<<< HEAD
                     <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please provide a valid zoom link.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Please use a valid ucsb zoom link prefixed with https://</Form.Text>
=======
                    <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please provide a valid zoom link.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Enter the full zoom link. Ex: https://ucsb.zoom.us/j/XXXXXXXXX</Form.Text>
>>>>>>> 677c8bd8951a5ec4b2096297deab462f1bc3be93
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="notes">
                <Form.Label column sm={2}>
                    Notes
                </Form.Label>
                <Col sm={10}>
                    <Form.Control ref={notesRef} type="text" placeholder="(Optional) Ex: midterm review" value={officeHour.notes} onChange={(e) => setOfficeHour({
                        ...officeHour,
                        notes: e.target.value
                    })} />
                    <Form.Control.Feedback style={{ textAlign: "left" }} type="invalid">
                        Please provide the notes.
                    </Form.Control.Feedback>
                    <Form.Text style={{ textAlign: "left" }} muted>Notes about the office hour. Ex: midterm review</Form.Text>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit">Submit</Button>
                </Col>
            </Form.Group>
        </Form>
    );
};

export default OfficeHourForm;
