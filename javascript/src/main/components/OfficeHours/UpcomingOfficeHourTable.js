import React from "react";
import useSWR from "swr";
import { fetchWithToken } from "main/utils/fetch";
import {asHumanQuarter} from "main/utils/quarter.ts"
import { useAuth0 } from "@auth0/auth0-react";
import BootstrapTable from 'react-bootstrap-table-next';


export default ({officeHours, user}) => {

    function zoomRoomLinkFormatter(cell) {
        return (
            <div><a target="_blank" rel = "noopener noreferrer" href={cell}> { cell } </a></div>
        );
    }

    const renderTutorName = (row) => row.tutorAssignment.tutor.firstName + " " + row.tutorAssignment.tutor.lastName;
    const renderCourseNameYear = (row) => {
        const quarter = row.tutorAssignment.course.quarter;
        return row.tutorAssignment.course.name + " " + asHumanQuarter(quarter);
    }

    const { user, getAccessTokenSilently: getToken } = useAuth0();
  
    const { data: roleInfo } = useSWR(
        ["/api/myRole", getToken],
        fetchWithToken
    );
    const isMember = roleInfo && roleInfo.role && (roleInfo.role.toLowerCase() !== "guest" || roleInfo.role.toLowerCase() === "admin" || roleInfo.role.toLowerCase() === "member");
   
    const columns = [{
        dataField: 'id',
        text: 'id'
    }, {
        dataField: 'startTime',
        text: 'Start Time'
    }, {
        dataField: 'endTime',
        text: 'End Time'
    }, {
        dataField: 'dayOfWeek',
        text: 'Day'
    }, {
        dataField: 'tutorName',
        text: 'Tutor',
        formatter: (_cell, row) => renderTutorName(row),
        sortValue: (_cell, row) => renderTutorName(row)
    }, {
        dataField: 'courseNameYear',
        text: 'Course',
        formatter: (_cell, row) => renderCourseNameYear(row),
        sortValue: (_cell, row) => renderCourseNameYear(row)
    },
    ];

    if (isMember) {
        columns.push({
                dataField: 'email',
                text: 'email'
            }, {
                dataField: 'zoomRoomLink',
                text: 'Zoom Room',
                formatter: zoomRoomLinkFormatter
            }
        );
    }

    return (
        <BootstrapTable 
            bootstrap4={true}
            keyField='id' 
            data={officeHours} 
            columns={columns} 
            striped 
        />
    );
}
