const express = require("express");
const multer = require("multer");

const upload = multer({ dest: "public/uploads/" });

const router = express.Router();

const uploadController = require("./controllers/uploadControllers");
const userControllers = require("./controllers/userControllers");
const offerControllers = require("./controllers/offerControllers");
const experienceControllers = require("./controllers/experienceControllers");
const courseControllers = require("./controllers/courseControllers");
const cvControllers = require("./controllers/cvControllers");
const competenceControllers = require("./controllers/competenceControllers");
const {
  authMiddleware,
  authAdminMiddleware,
} = require("./middlewares/security/auth.middlewares");
// const OfferCompetenceManager = require("./models/OfferCompetenceManager");

/* USER. */
router.get(
  "/users",
  authMiddleware,
  authAdminMiddleware,
  userControllers.getUsers
);
router.get("/users/:id([0-9]+)/cvs", authMiddleware, cvControllers.getCv);
router.get("/users/:id([0-9]+)", authMiddleware, userControllers.getUserById);
router.get("/users/me", authMiddleware, userControllers.getProfile);
router.post("/users", userControllers.postUser);
router.post("/users/:id([0-9]+)/set/skills", userControllers.setSkills);
router.get(
  "/users/me/get-matching-offers",
  authMiddleware,
  userControllers.getMatchingOffers
);
router.put(
  "/users/edit/:id([0-9]+)",
  authMiddleware,
  userControllers.updateUser
);

// FOR ADMIN. */
router.delete(
  "/admin/users/:id([0-9]+)",
  authMiddleware,
  authAdminMiddleware,
  userControllers.deleteUser
);
/* SKILLS. */
router.get("/skills", competenceControllers.getSkills);
router.post("/login", userControllers.postLogin);

/* OFFERS. */
router.get("/offer", offerControllers.getOffers);
router.get("/offer/:id([0-9]+)", offerControllers.getOfferById);
router.get("/offers/:id([0-9]+)/skills", offerControllers.getSkillsByOfferId);
router.post(
  "/offer",
  authMiddleware,
  authAdminMiddleware,
  offerControllers.postOffer
);
router.put(
  "/offer/:id([0-9]+)",
  authMiddleware,
  authAdminMiddleware,
  offerControllers.putOffer
);
router.delete(
  "/offer/:id([0-9]+)",
  authMiddleware,
  authAdminMiddleware,
  offerControllers.deleteOfferById
);
router.post(
  "/offers/:id([0-9]+)/add/skills",
  authMiddleware,
  authAdminMiddleware,
  offerControllers.addSkills
);

/* EXPERIENCES. */
router.get(
  "/experiences/by-cv-id/:id([0-9]+)",
  authMiddleware,
  experienceControllers.getExperiencesByCvId
);
router.get(
  "/experience/:id([0-9]+)",
  authMiddleware,
  experienceControllers.getExperienceById
);
router.post(
  "/experience",
  authMiddleware,
  experienceControllers.postExperience
);
router.put(
  "/experience/:id([0-9]+)",
  authMiddleware,
  experienceControllers.updateExperience
);
router.delete(
  "/experience/:id([0-9]+)",
  authMiddleware,
  experienceControllers.deleteExperienceById
);

/* COURSES. */
router.get(
  "/courses/by-cv-id/:id([0-9]+)",
  authMiddleware,
  courseControllers.getCoursesByCvId
);
// Pas utilisé en front
router.get(
  "/course/:id([0-9]+)",
  authMiddleware,
  courseControllers.getCourseById
);
router.post("/course", authMiddleware, courseControllers.postCourse);
router.put(
  "/course/:id([0-9]+)",
  authMiddleware,
  courseControllers.updateCourse
);
router.delete(
  "/course/:id([0-9]+)",
  authMiddleware,
  courseControllers.deleteCourseById
);

// UPLOADS
router.post(
  "/uploads/:id",
  authMiddleware,
  upload.single("avatar"),
  uploadController.createUpload
);

module.exports = router;
