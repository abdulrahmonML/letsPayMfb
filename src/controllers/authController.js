const authService = require("../services/authService");

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, dob } = req.body;

    const firstName = name.firstName;
    const lastName = name.lastName;
    const user = await authService.register(
      firstName,
      lastName,
      phone,
      email,
      password,
      dob,
    );

    return res.status(200).json({
      success: true,
      message: `User ${lastName} ${firstName} created successfully`,
    });
  } catch (error) {
    console.log(error); // This will tell you exactly which line in the service is dying
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser };
