import Workout from "../Models/Workout.js";

// @desc    Get workouts
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate({
        path: "trainerId",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "memberId",
        populate: { path: "userId", select: "name email" },
      });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res) => {
  try {
    const { trainerId, memberId, exercises, notes } = req.body;
    const workout = await Workout.create({
      trainerId,
      memberId,
      exercises,
      notes
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (workout) {
      const updatedWorkout = await Workout.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedWorkout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (workout) {
      await Workout.deleteOne({ _id: req.params.id });
      res.json({ message: "Workout removed" });
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
