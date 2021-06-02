
import React from "react";
import { render } from "@testing-library/react";
import useSWR from "swr";
import TutorNotesForm from "main/components/TutorNotes/TutorNotesForm";
import userEvent from "@testing-library/user-event";
jest.mock("swr");

describe("TutorNotesForm tests", () => {
  const sampleOfficeHour = {
    "id": "",
    "startTime": "2:00PM",
    "endTime": "3:00PM",
    "dayOfWeek": "Wednesday",
    "zoomRoomLink": "https://ucsb.zoom.us.test",
    "notes": "noted",
    "tutorAssignment": {
      "id": 2,
    },
  };

    const sampleTutorNotes = {
          id: 1,
          course:  {name: "CMPSC 156",
                    id: 1,
                    quarter: "20202",
                    instructorFirstName: "Phill",
                    instructorLastName: "Conrad",
                    instructorEmail: "phtcon@ucsb.edu",
                    },
          tutor:    {email: "scottpchow@ucsb.edu",
                    firstName: "Scott",
                    id: 1,
                    lastName: "Chow"},
          message: "Write message here"
        };

    const _sampleTutorNotes2 = {
      id: 1,
      course:  {name: "CMPSC 148",
                id: 2,
                quarter: "20203",
                instructorFirstName: "Chandra",
                instructorLastName: "Krintz",
                instructorEmail: "krintz@example.org",
                },
        tutor:  {email: "scottpchow@ucsb.edu",
                firstName: "Scott",
                id: 1,
                lastName: "Chow"},
        message: "TA",
      };
    const mutateSpy = jest.fn();

  test("empty component renders without crashing", () => {
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      mutate: mutateSpy,
    });
    render(<TutorNotesForm />);
  });

  test("component with existing course renders without crashing", () => {
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      mutate: mutateSpy,
    });
    render(<TutorNotesForm existingTutorNotes={sampleTutorNotes}/>);
  });

  test("error mesage appears if you are a member but not an admin or instructor", () => {
    useSWR.mockReturnValue({
        data: undefined,
        error: true,
        mutate: mutateSpy,
    });
    const { getByText } = render(<TutorNotesForm />);
    const errorMessage = getByText("You must be an instructor or an admin to create new Tutor Notes or we have found no Courses/Tutors.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("loading appears if course list is not returned yet", () => {
    useSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        mutate: mutateSpy,
    });
    const { getByAltText } = render(<TutorNotesForm />);
    const loading = getByAltText("Loading");
    expect(loading).toBeInTheDocument();
  });

  test("creating TutorNotes works", async () => {

    useSWR.mockReturnValue({
      data: sampleOfficeHour,
      error: undefined,
      mutate: mutateSpy,
  });

    const createTutorNotesMock = jest.fn();

    const { getByLabelText, getByText } = render
      (<TutorNotesForm createTutorNotes={createTutorNotesMock} />)
    ;

    const officeHoursSelect = getByLabelText("Office Hours");
    userEvent.selectOptions(officeHoursSelect, "0");

    const messageInput = getByLabelText("Message");
    userEvent.type(messageInput, sampleTutorNotes.message)

    const submitButton = getByText("Submit");
    userEvent.click(submitButton);

    expect(createTutorNotesMock).toHaveBeenCalledTimes(1);
    expect(createTutorNotesMock).toHaveBeenCalledWith({ ...sampleTutorNotes, id: null, index: 0});
  });


});