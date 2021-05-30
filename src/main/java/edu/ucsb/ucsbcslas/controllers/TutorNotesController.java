package edu.ucsb.ucsbcslas.controllers;

import edu.ucsb.ucsbcslas.entities.AppUser;
import edu.ucsb.ucsbcslas.entities.OnlineOfficeHours;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import javax.validation.Valid;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.ucsbcslas.advice.AuthControllerAdvice;
import edu.ucsb.ucsbcslas.models.Course;
import edu.ucsb.ucsbcslas.entities.Tutor;
import edu.ucsb.ucsbcslas.entities.TutorNotes;
import edu.ucsb.ucsbcslas.entities.TutorAssignment;
import edu.ucsb.ucsbcslas.repositories.CourseRepository;
import edu.ucsb.ucsbcslas.repositories.OnlineOfficeHoursRepository;
import edu.ucsb.ucsbcslas.repositories.TutorRepository;
import edu.ucsb.ucsbcslas.repositories.TutorNotesRepository;
import edu.ucsb.ucsbcslas.repositories.TutorAssignmentRepository;

@RestController
public class TutorNotesController {
    private final Logger logger = LoggerFactory.getLogger(TutorNotesController.class);

    @Autowired
    private AuthControllerAdvice authControllerAdvice;
    @Autowired
    private TutorNotesRepository tutorNotesRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private TutorRepository tutorRepository;
    @Autowired
    private TutorAssignmentRepository tutorAssignmentRepository;
    @Autowired
    private OnlineOfficeHoursRepository onlineOfficeHoursRepository;

    private ObjectMapper mapper = new ObjectMapper();

    private ResponseEntity<String> getUnauthorizedResponse(String roleRequired) throws JsonProcessingException {
        Map<String, String> response = new HashMap<String, String>();
        response.put("error", String.format("Unauthorized; only %s may access this resource.", roleRequired));
        String body = mapper.writeValueAsString(response);
        return new ResponseEntity<String>(body, HttpStatus.UNAUTHORIZED);
    }

    private ResponseEntity<String> getIncorrectInputResponse() throws JsonProcessingException {
        Map<String, String> response = new HashMap<String, String>();
        response.put("error", String
                .format("Misformatted Input; Check that the tutor email that was input is assigned to a valid tutor"));
        String body = mapper.writeValueAsString(response);
        return new ResponseEntity<String>(body, HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/api/member/tutorNotes", produces = "application/json")
    public ResponseEntity<String> createTutorNotes(@RequestHeader("Authorization") String authorization,
            @RequestBody @Valid String tutorNotes) throws JsonProcessingException {
        if (!authControllerAdvice.getIsMember(authorization)) {
            return new ResponseEntity<>("Unauthorized Request", HttpStatus.UNAUTHORIZED);
        }

        String currentUserEmail = authControllerAdvice.getUser(authorization).getEmail();

        List<OnlineOfficeHours> onlineOfficeHours = onlineOfficeHoursRepository
                .findByTutorAssignmentTutorEmail(currentUserEmail);

        JSONObject tutorNotesAsJson = new JSONObject(tutorNotes);
        JSONObject officeHoursAsJson = new JSONObject(tutorNotesAsJson.get("officeHours").toString());
        Long officeHoursId = officeHoursAsJson.getLong("id");
        Stream<OnlineOfficeHours> filtered = onlineOfficeHours.stream().filter(ooh -> ooh.getId() == officeHoursId);

        if (filtered.count() == 0) {
            return new ResponseEntity<>(
                    "Unauthorized Request: Email of current user does not match email of office hours selected",
                    HttpStatus.UNAUTHORIZED);
        }

        Optional<OnlineOfficeHours> ooh = onlineOfficeHoursRepository.findById(officeHoursId);
        TutorNotes newNotes = new TutorNotes();
        newNotes.setOnlineOfficeHours(ooh.get());
        newNotes.setMessage(tutorNotesAsJson.getString("message"));

        logger.info("newNotes= {}", newNotes);
        TutorNotes savedTutorNotes = tutorNotesRepository.save(newNotes);
        String body = mapper.writeValueAsString(savedTutorNotes);
        return ResponseEntity.ok().body(body);
    }

    // @GetMapping(value = "/api/member/tutorNotes", produces = "application/json")
    // public ResponseEntity<String> getTutorNotes(@RequestHeader("Authorization")
    // String authorization)
    // throws JsonProcessingException {
    // List<TutorNotes> tutorNotesList = new ArrayList();
    // if (!authControllerAdvice.getIsMember(authorization)) {
    // return new ResponseEntity<>("Unauthorized Request", HttpStatus.UNAUTHORIZED);
    // }
    // if (authControllerAdvice.getIsAdmin(authorization)) {
    // tutorNotesList = tutorNotesRepository.findAll();
    // if (tutorNotesList.isEmpty()) {
    // return ResponseEntity.notFound().build();
    // }
    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotesList);
    // return ResponseEntity.ok().body(body);
    // }
    // else {
    // List<Course> courseList = courseRepository
    // .findAllByInstructorEmail(authControllerAdvice.getUser(authorization).getEmail());
    // if (!(courseList.isEmpty())) {
    // for (Course temp : courseList) {
    // Optional<Course> course = courseRepository.findById(temp.getId());
    // List<TutorNotes> tutorNotes =
    // tutorNotesRepository.findAllByCourse(course.get());
    // tutorNotesList.addAll(tutorNotes);
    // }
    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotesList);
    // return ResponseEntity.ok().body(body);
    // }
    // }
    // Optional<Tutor> tutor =
    // tutorRepository.findByEmail(authControllerAdvice.getUser(authorization).getEmail());
    // if (tutor.isPresent()) {
    // List<TutorNotes> tutorNotes =
    // tutorNotesRepository.findAllByTutor(tutor.get());
    // tutorNotesList.addAll(tutorNotes);
    // }
    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotesList);
    // return ResponseEntity.ok().body(body);
    // }

    // @GetMapping(value = "/api/member/tutorNotes/byCourseId/{course_id}", produces
    // = "application/json")
    // public ResponseEntity<String>
    // getTutorNotesByCourseID(@PathVariable("course_id") Long course_id,
    // @RequestHeader("Authorization") String authorization) throws
    // JsonProcessingException {
    // if (!authControllerAdvice.getIsMember(authorization)) {
    // return new ResponseEntity<>("Unauthorized Request", HttpStatus.UNAUTHORIZED);
    // }
    // List<TutorNotes> tutorNotes = tutorNotesRepository.findAllById(course_id);
    // // if (tutorNotes.isEmpty()) {
    // // return ResponseEntity.notFound().build();
    // // }
    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotes);
    // return ResponseEntity.ok().body(body);
    // }

    // /**
    // * return a list of all course numbers that appear in the tutor Notes table
    // *
    // * @return response containing a list of all course numbers
    // * @throws JsonProcessingException
    // */
    // @GetMapping(value = "/api/member/tutorNotes/course_numbers", produces =
    // "application/json")
    // public ResponseEntity<String>
    // getCourseNumbers(@RequestHeader("Authorization") String authorization)
    // throws JsonProcessingException {
    // if (!authControllerAdvice.getIsMember(authorization)) {
    // return new ResponseEntity<>("Unauthorized Request", HttpStatus.UNAUTHORIZED);
    // }
    // List<TutorNotes> tutorNotes = tutorNotesRepository.findAll();
    // Set<String> courseNumbers = new HashSet<String>();
    // for (TutorNotes ta : tutorNotes) {
    // courseNumbers.add(ta.getCourse().getName());

    // }

    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(courseNumbers);
    // return ResponseEntity.ok().body(body);
    // }

    // @GetMapping(value = "/api/member/tutorNotes/byCourseNumber/{courseNumber}",
    // produces = "application/json")
    // public ResponseEntity<String>
    // getTutorNotesByCourseID(@PathVariable("courseNumber") String courseNumber,
    // @RequestHeader("Authorization") String authorization)
    // throws JsonProcessingException {

    // if (!authControllerAdvice.getIsMember(authorization)) {
    // return new ResponseEntity<>("Unauthorized Request", HttpStatus.UNAUTHORIZED);
    // }
    // List<TutorNotes> tutorNotes = tutorNotesRepository.findAll();
    // List<TutorNotes> tutorNotesMatchingCourse = new ArrayList<TutorNotes>();
    // for (TutorNotes ta : tutorNotes) {
    // if (ta.getCourse().getName().equals(courseNumber)) {
    // tutorNotesMatchingCourse.add(ta);
    // }

    // }
    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotesMatchingCourse);
    // return ResponseEntity.ok().body(body);
    // }

    // @GetMapping(value = "/api/member/tutorNotes/byTutor/{tutor}", produces =
    // "application/json")
    // public ResponseEntity<String> getTutorNotesByTutor(@PathVariable("tutor")
    // String tutorEmail)
    // throws JsonProcessingException {

    // Optional<Tutor> tutor = tutorRepository.findByEmail(tutorEmail);
    // List<TutorNotes> tutorNotes = new ArrayList<TutorNotes>();
    // tutorNotes = tutorNotesRepository.findAllByTutor(tutor.get());
    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotes);
    // return ResponseEntity.ok().body(body);

    // }

    // @GetMapping(value = "/api/member/tutorNotes/{id}", produces =
    // "application/json")
    // public ResponseEntity<String> getTutorNotes(@PathVariable("id") Long id)
    // throws JsonProcessingException {
    // Optional<TutorNotes> tutorNotes = tutorNotesRepository.findById(id);
    // if (tutorNotes.isEmpty()) {
    // return ResponseEntity.notFound().build();
    // }

    // ObjectMapper mapper = new ObjectMapper();
    // String body = mapper.writeValueAsString(tutorNotes.get());
    // return ResponseEntity.ok().body(body);
    // }

    // @PutMapping(value = "/api/member/tutorNotes/{id}", produces =
    // "application/json")
    // public ResponseEntity<String>
    // updateTutorNotes(@RequestHeader("Authorization") String authorization,
    // @PathVariable("id") Long id, @RequestBody @Valid String incomingTutorNotes)
    // throws JsonProcessingException {
    // if (!authControllerAdvice.getIsMember(authorization)) {
    // return new ResponseEntity<>("Unauthorized Request", HttpStatus.UNAUTHORIZED);
    // }
    // if (!authControllerAdvice.getIsAdmin(authorization)) {
    // return getUnauthorizedResponse("admin");
    // }
    // Optional<TutorNotes> tutorNotes = tutorNotesRepository.findById(id);
    // if (!tutorNotes.isPresent()) {
    // return ResponseEntity.notFound().build();
    // }
    // logger.info(incomingTutorNotes);
    // JSONObject ta = new JSONObject(incomingTutorNotes);
    // TutorNotes newNotes = new TutorNotes();
    // logger.info("ta: ", ta.toString());
    // JSONObject cInfo = new JSONObject(ta.get("course").toString());
    // logger.info("cInfo: ", cInfo.toString());
    // Course c = new Course(cInfo.getLong("id"), cInfo.getString("name"),
    // cInfo.getString("quarter"),
    // cInfo.getString("instructorFirstName"),
    // cInfo.getString("instructorLastName"),
    // cInfo.getString("instructorEmail"));
    // newNotes.setCourse(c);

    // logger.info("tutorNotes: ", tutorNotes.get().getTutor().getEmail());
    // logger.info("ta: ", ta.getString("tutorEmail"));
    // if
    // (!(ta.getString("tutorEmail").equals(tutorNotes.get().getTutor().getEmail())))
    // {
    // Optional<Tutor> tutor =
    // tutorRepository.findByEmail(ta.getString("tutorEmail"));
    // logger.info("tutor: ", tutor);
    // if (tutor.isPresent()) {
    // newNotes.setTutor(tutor.get());
    // } else {
    // return getIncorrectInputResponse();
    // }
    // } else {

    // JSONObject tInfo = new JSONObject(ta.get("tutor").toString());
    // Tutor t = new Tutor(tInfo.getLong("id"), tInfo.getString("firstName"),
    // tInfo.getString("lastName"),
    // tInfo.getString("email"));
    // newNotes.setTutor(t);

    // }
    // newNotes.setMessage(ta.getString("NotesType"));

    // newNotes.setId(id);
    // tutorNotesRepository.save(newNotes);
    // String body = mapper.writeValueAsString(newNotes);
    // return ResponseEntity.ok().body(body);
    // }

}
