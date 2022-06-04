let router = require("express").Router();
let mongoose = require("mongoose");
let Announcement = mongoose.model("Announcement");
let faker = require("faker");
let { OkResponse, BadRequestResponse } = require("express-http-response");
router.param("id", function (req, res, next, id) {
    Announcement.findOne({ _id: id, isDelete: false })
        .populate("createdBy")
        .then((doc) => {
            if (!doc) {
                return res.sendStatus(404);
            }
            req.announcement = doc;
            return next();
        })
        .catch(next);
});
// return all announcement
router.get("/all", function (req, res, next) {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        sort: {
            createdAt: -1,
        },
        populate: ["createdBy"],
    };

    Announcement.paginate({ isDelete: false }, options, function (err, result) {
        if (err) {
            next(new BadRequestResponse("Server Error"));
        }
        next(new OkResponse({ result: result }));
    });
});


router.get("/:id", function (req, res, next) {
    next(new OkResponse({ announcement: req.announcement }));
});


// create announcement
router.post("/", async function (req, res, next) {
    if (req.body.title) {
        let announcement = await Announcement.findOne({ title: req.body.title });
        if (announcement) next(new BadRequestResponse("announcement already exist", 401));
        else
            new Announcement({
                title: req.body.title,
                description: req.body.description,
                createdBy: req.user,
            }).save((err, doc) => {
                lolSocket.emit('Announcements');
                if (err) {
                    next(new BadRequestResponse("Server Error"));
                } else {
                    next(new OkResponse({ announcement: doc }));
                }
            });
    } else {
        next(new BadRequestResponse("missing parameters", 422));
    }
});

// updates announcment
router.put("/:id", function (req, res, next) {
    if (req.body.title) {
        req.announcement.title = req.body.title;
        req.announcement.description = req.body.description;
        req.announcement.save((err, doc) => {
            lolSocket.emit('Announcements');
            if (err) {
                next(new BadRequestResponse("Server Error"));
            } else {
                next(new OkResponse({ announcement: doc }));
            }
        });
    } else {
        next(new BadRequestResponse("missing parameters", 422));
    }
});

router.delete("/:id", function (req, res, next) {
    req.announcement.isDelete = true;
    req.announcement.save((err, doc) => {
        lolSocket.emit('Announcements');
        if (err) {
            next(new BadRequestResponse("Server Error"));
        } else {
            next(new OkResponse({ announcement: doc }));
        }
    });
});

module.exports = router;
