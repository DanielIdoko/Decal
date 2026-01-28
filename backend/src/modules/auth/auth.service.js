/**
 * @description Save user to database from clerk webhook event "user.createsd"
 * @access Public
 *  **/
export const handleCreateUser = async (event) => {
  const { id, first_name, last_name, email_addresses, username, image_url } =
    event.data;

  // Extract the primary email address
  const primaryEmail = email_addresses.find(
    (email) => email.id === event.data.primary_email_address_id,
  )?.email_address;

  try {
    // Save user to database
    const newUser = await User.create({
      clerkId: id, // Store Clerk User ID for lookups
      sub_profile: {
        firstName: first_name,
        lastName: last_name,
        profileImage: image_url,
      },
      username: username,
      email: primaryEmail,
    });

    console.log(`User created in DB: ${id}`);
  } catch (dbError) {
    console.error("Database error on user creation:", dbError);
  }
};
