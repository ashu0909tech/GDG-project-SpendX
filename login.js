// 1. Password Visibility Toggle
        function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('ri-eye-off-line');
                icon.classList.add('ri-eye-line');
            } else {
                input.type = "password";
                icon.classList.add('ri-eye-off-line');
                icon.classList.remove('ri-eye-line');
            }
        }

        // 2. Switch between Login and Signup
        function toggleForm() {
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const title = document.getElementById('form-title');
            const toggleText = document.getElementById('toggle-text');

            if (loginForm.classList.contains('hidden')) {
                // Switch to Login
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
                title.innerText = "Welcome back!";
                toggleText.innerHTML = 'New here? <a onclick="toggleForm()">Sign up now &rarr;</a>';
            } else {
                // Switch to Signup
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                title.innerText = "Create Account";
                toggleText.innerHTML = 'Already have an account? <a onclick="toggleForm()">Log in</a>';
            }
        }

        // 3. Handle Form Submission (Simulate Login)
        function handleLogin(e) {
            e.preventDefault();
            const btn = e.target.querySelector('.btn-primary');
            const originalText = btn.innerText;
            
            // Loading State
            btn.innerText = "Authenticating...";
            btn.style.opacity = "0.8";

            // Simulate server delay
            setTimeout(() => {
                // Redirect to the Dashboard created previously
                // Ensure your previous file is named 'index.html'
                window.location.href = "index.html"; 
            }, 1000);
        }