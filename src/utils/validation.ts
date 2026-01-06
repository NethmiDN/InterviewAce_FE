
export const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
        return "Password must be at least 8 characters long."
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter."
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter."
    }
    if (!/\d/.test(password)) {
        return "Password must contain at least one number."
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return "Password must contain at least one special character."
    }
    return null
}

export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required."
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address."
    }
    return null
}

export const validateFirstName = (name: string): string | null => {
    if (!name || !name.trim()) return "First name is required."
    if (name.trim().length < 2) return "First name must be at least 2 characters."
    // Optional: Check for special characters if allowed
    if (!/^[a-zA-Z\s\-\']+$/.test(name)) {
        return "First name matches invalid characters."
    }
    return null
}

export const validateLastName = (name: string): string | null => {
    if (!name || !name.trim()) return "Last name is required."
    if (name.trim().length < 2) return "Last name must be at least 2 characters."
    if (!/^[a-zA-Z\s\-\']+$/.test(name)) {
        return "Last name matches invalid characters."
    }
    return null
}
