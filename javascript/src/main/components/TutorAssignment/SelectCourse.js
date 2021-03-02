import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { compareValues } from "main/utils/sortHelper";
import { asQyy } from "main/utils/quarter";
import CourseShow from "../../pages/Courses/CourseShow";

const briefCourseInfo = (course) => {
    if (course && course.name && course.quarter && course.instructorFirstName && course.instructorLastName )
        return `${course.name} ${asQyy(course.quarter)} ${course.instructorFirstName} ${course.instructorLastName}`
    else
        return "no course selected"
}

export default ({ courseIndex, setCourseIndex, courses }) => {

    const initialCourseInfo = briefCourseInfo(courses[courseIndex]);
    console.log("initialCourseInfo=",initialCourseInfo);

    const handleCourseOnChange = (event) => {
        setCourseIndex(event.target.value);
    };

    console.log("courses=",courses);
    
    if ( courses && courses.sort) 
        courses.sort(compareValues("name"));

    return (
        <Form.Group controlId="SelectCourse.Course">
            <Form.Label>Course</Form.Label>
            <Form.Control as="select" onChange={handleCourseOnChange} value={courseIndex}>
                {courses.map((object, i) => {
                    return <option key={i} value={i}>{object.name}</option>;
                })}
            </Form.Control>
            <Form.Text className="text-muted">
                {briefCourseInfo(courses[courseIndex])}
            </Form.Text>
        </Form.Group>
    );
};
