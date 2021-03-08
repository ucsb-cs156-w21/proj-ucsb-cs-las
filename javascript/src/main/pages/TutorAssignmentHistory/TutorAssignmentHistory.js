import React from "react";
import { useEffect } from "react";
import useSWR from "swr";
import { fetchWithToken } from "main/utils/fetch";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "main/components/Loading/Loading";

import Select from 'react-select'
import {useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';



const TutorAssignmentHistory = () => {

  const { getAccessTokenSilently: getToken } = useAuth0();

  const { data: tutorList} = useSWR(
    ["/api/member/tutors", getToken],
    fetchWithToken
  );

  const [tutorEmail, setTutorEmail] = useState("")
  const [tutorAssignments, setTutorAssignments] = useState([])
  const [TAMapping, setTAMapping] = useState([])



  useEffect(()=>{
  	const getTutorAssignments = async () => {
  		const res = await fetchWithToken(`/api/member/tutorAssignment/byTutor/${tutorEmail}`, getToken)
  		setTutorAssignments(res)
  	}
  	if(tutorEmail!==""){
  		getTutorAssignments()
  	}
  },[getToken, tutorEmail])

  useEffect(()=>{
  	if(tutorAssignments.length>0){
  		const res = tutorAssignments.map((TA,index) => ({
  		"assignmentType" : TA.assignmentType,
      	"courseName" : TA.course.name,
      	"quarter" : TA.course.quarter,
      	"id": index
    }))
  		setTAMapping(res);
  	}else{
  		setTAMapping([]);
  	}
  },[tutorAssignments])

  if (!tutorList) {
    return <Loading/>;
  }

  const columns = [
  	{
  		dataField: 'assignmentType',
  		text: 'Assignment Type'
  	}, {
  		dataField: 'courseName',
  		text: 'Course Name'
  	}, {
  		dataField: 'quarter',
  		text: 'Quarter'
  	}
  	];

  	const tutors = tutorList.map(tutor => ({
    	"value" : tutor.id,
      	"label" : tutor.firstName + " " + tutor.lastName,
      	"firstName" : tutor.firstName,
      	"lastName" : tutor.lastName,
      	"email" : tutor.email
      }))

  	const onchangeSelect = (item) => {
  		setTutorEmail(item.email);
  	};


  return (
    <>

      <h1>Search for Tutor Assignment History by Tutor</h1>
       <div>
        <Select
			options={tutors}
			onChange={onchangeSelect}
          	getOptionValue={(option) => option.value}
		/>
		{TAMapping.length>0 ? <BootstrapTable keyField='id'  data = {TAMapping} columns={columns} />: <div>This tutor has no tutor assignment history.</div>}
		 
		{/*courseList.length==0 && <div>No Courses</div>*/}

      </div>

    </>
  );
};

export default TutorAssignmentHistory;