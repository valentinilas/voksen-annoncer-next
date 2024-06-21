export async function handleLogout() {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
        });
        if (response.ok) {
            // Redirect or update UI as needed
            window.location.href = '/sign-in';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}