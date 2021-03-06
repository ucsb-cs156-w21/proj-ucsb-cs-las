import React from "react";
import { render } from "@testing-library/react";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams} from "react-router-dom";
import CourseShow from "main/pages/Courses/CourseShow";
jest.mock("swr");
jest.mock("@auth0/auth0-react");
jest.mock("main/utils/fetch");

jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use real functions 
  useParams: jest.fn(), // except for just this one
}));



describe("Course Show Page Test", () => { 
	const course =
	{
	  name: "CMPSC 156",
	  id: 1,
	  quarter: "F20",
	  instructorFirstName: "Phill",
	  instructorLastName: "Conrad",
	  instructorEmail: "phtcon@ucsb.edu",
	};
	
	const user = {
		name: "test user",
	};
	const getAccessTokenSilentlySpy = jest.fn();
	const mutateSpy = jest.fn();
  
	beforeEach(() => {
		useAuth0.mockReturnValue({
			admin: undefined,
			getAccessTokenSilently: getAccessTokenSilentlySpy,
			user: user,
		});
		useSWR.mockImplementation((key, _getter)=>{
			if (key[0] === "/api/myRole") {
				return { data : {
					role: "Member"
				}};
			} else {
				return {
					data : [course]
				}
			}
		})
		useParams.mockReturnValue({
			courseId: '1'
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders loading while course show is undefined", () => {

		useSWR.mockImplementation((key, _getter) => {
			console.log("Key[0]=",key[0])
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Admin"
					}
				};
			} else if(key[0].startsWith("/api/member/courses/show/")){
				return {
					data: [course]
				}
			} else{
				return {
					data: undefined,
      				error: "ERROR!",
      				mutate: mutateSpy
      			}
			}
		});

    	const { getByText } = render(<CourseShow />);
    	const loading = getByText("We encountered an error; please reload the page and try again.");
    	expect(loading).toBeInTheDocument();
    });

  
    
	test("empty component renders without crashing", () => {
		render(<CourseShow />);
	});

	test("display page with admin access", () => {
		useSWR.mockImplementation((key, _getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Admin"
					}
				};
			} else {
				return {
					data: [course]
				}
			}
		});
		render(<CourseShow existingCourse={course}/>);
	});

	test("renders loading waiting for viewlist without crashing", () => {
		useSWR.mockImplementation((key, _getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Member"
					}
				};
			} else {
				return {
					data: null
				}
			}
		});
		const screen = render(<CourseShow />);
		expect(screen.getByAltText("Loading")).toBeInTheDocument();
	});

	test("display error messages", () => {
		useSWR.mockImplementation((key, _getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Guest"
					}
				};
			} else {
				return {
					data: null,
					error: true
				}
			}
		});
		const screen = render(<CourseShow />);
		expect(screen.getByText("We encountered an error; please reload the page and try again.")).toBeInTheDocument();
	});

	test("display error messages", () => {
		useSWR.mockImplementation((key, _getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: null
				};
			} else {
				return {
					data: null,
					error: true
				}
			}
		});
		const screen = render(<CourseShow />);
		expect(screen.getByText("We encountered an error; please reload the page and try again.")).toBeInTheDocument();
	});
	
	test("component with existing course renders without crashing", () => {
		render(<CourseShow existingCourse={course}/>);
    });
});