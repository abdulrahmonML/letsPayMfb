const authService = require("../services/authService");

const registerUser = async (req, res, next) => {
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
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
