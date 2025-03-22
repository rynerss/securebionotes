interface User {
  username: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  error: string | null;
}

// Store user credentials in local storage
export const registerUser = (
  username: string,
  password: string,
): AuthResult => {
  try {
    // Check if username already exists
    const existingUsers = getUsers();
    if (existingUsers.some((user) => user.username === username)) {
      return {
        success: false,
        error: "Username already exists",
      };
    }

    // Add new user
    existingUsers.push({ username, password });
    localStorage.setItem("bioNotesUsers", JSON.stringify(existingUsers));

    // Set current user
    setCurrentUser(username);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register user",
    };
  }
};

// Authenticate user with username and password
export const authenticateUser = (
  username: string,
  password: string,
): AuthResult => {
  try {
    const users = getUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: "Incorrect password",
      };
    }

    // Set current user
    setCurrentUser(username);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
};

// Get all registered users
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem("bioNotesUsers");
  return usersJson ? JSON.parse(usersJson) : [];
};

// Set current authenticated user
export const setCurrentUser = (username: string): void => {
  localStorage.setItem("bioNotesCurrentUser", username);
};

// Get current authenticated user
export const getCurrentUser = (): string | null => {
  return localStorage.getItem("bioNotesCurrentUser");
};

// Log out current user
export const logoutUser = (): void => {
  localStorage.removeItem("bioNotesCurrentUser");
};

// Get user-specific storage key prefix
export const getUserStoragePrefix = (): string => {
  const currentUser = getCurrentUser();
  return currentUser ? `bioNotes_${currentUser}_` : "bioNotes_";
};
