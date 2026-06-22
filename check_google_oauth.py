#!/usr/bin/env python3
"""
Google OAuth Configuration Checker for KisanMitra
This script verifies that Google login is properly configured.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60 + "\n")

def print_status(check_name, passed, message=""):
    """Print check status"""
    status = "âœ… PASS" if passed else "âŒ FAIL"
    print(f"{status} - {check_name}")
    if message:
        print(f"       {message}")

def check_backend_env():
    """Check backend environment configuration"""
    print_header("Backend Configuration Check")
    
    # Load backend .env
    backend_path = Path(__file__).parent / 'back' / '.env'
    if not backend_path.exists():
        print_status("Backend .env file", False, "File not found at: back/.env")
        return False
    
    print_status("Backend .env file", True, f"Found at: {backend_path}")
    
    # Load environment variables
    load_dotenv(backend_path)
    
    # Check GOOGLE_CLIENT_ID
    google_client_id = os.getenv('GOOGLE_CLIENT_ID')
    if not google_client_id:
        print_status("GOOGLE_CLIENT_ID", False, "Not set in back/.env")
        return False
    elif google_client_id == 'your_google_client_id_here':
        print_status("GOOGLE_CLIENT_ID", False, "Still using placeholder value")
        print(f"       Please replace with actual Client ID from Google Console")
        return False
    else:
        # Check if it looks like a valid Client ID
        if '.apps.googleusercontent.com' in google_client_id:
            print_status("GOOGLE_CLIENT_ID", True, f"Set to: {google_client_id[:30]}...")
            return True
        else:
            print_status("GOOGLE_CLIENT_ID", False, "Format doesn't match Google Client ID pattern")
            print(f"       Should end with '.apps.googleusercontent.com'")
            return False

def check_frontend_env():
    """Check frontend environment configuration"""
    print_header("Frontend Configuration Check")
    
    # Check frontend .env
    frontend_path = Path(__file__).parent / 'frontend' / '.env'
    if not frontend_path.exists():
        print_status("Frontend .env file", False, "File not found at: frontend/.env")
        return False
    
    print_status("Frontend .env file", True, f"Found at: {frontend_path}")
    
    # Read frontend .env (don't use load_dotenv to avoid conflicts)
    with open(frontend_path, 'r') as f:
        content = f.read()
    
    # Check REACT_APP_GOOGLE_CLIENT_ID
    if 'REACT_APP_GOOGLE_CLIENT_ID=' not in content:
        print_status("REACT_APP_GOOGLE_CLIENT_ID", False, "Not found in frontend/.env")
        return False
    
    # Extract the value
    for line in content.split('\n'):
        if line.startswith('REACT_APP_GOOGLE_CLIENT_ID='):
            client_id = line.split('=', 1)[1].strip()
            if not client_id or client_id == 'your_google_client_id_here':
                print_status("REACT_APP_GOOGLE_CLIENT_ID", False, "Still using placeholder value")
                print(f"       Please replace with actual Client ID from Google Console")
                return False
            elif '.apps.googleusercontent.com' in client_id:
                print_status("REACT_APP_GOOGLE_CLIENT_ID", True, f"Set to: {client_id[:30]}...")
                return True
            else:
                print_status("REACT_APP_GOOGLE_CLIENT_ID", False, "Format doesn't match Google Client ID pattern")
                return False
    
    return False

def check_backend_dependencies():
    """Check if required Python packages are installed"""
    print_header("Backend Dependencies Check")
    
    try:
        import google.auth
        print_status("google-auth", True, f"Version: {google.auth.__version__}")
    except ImportError:
        print_status("google-auth", False, "Not installed. Run: pip install google-auth")
        return False
    
    try:
        import google_auth_oauthlib
        print_status("google-auth-oauthlib", True, "Installed")
    except ImportError:
        print_status("google-auth-oauthlib", False, "Not installed. Run: pip install google-auth-oauthlib")
        return False
    
    try:
        import google_auth_httplib2
        print_status("google-auth-httplib2", True, "Installed")
    except ImportError:
        print_status("google-auth-httplib2", False, "Not installed. Run: pip install google-auth-httplib2")
        return False
    
    return True

def check_backend_code():
    """Check if backend has Google login endpoint"""
    print_header("Backend Code Check")
    
    main_py = Path(__file__).parent / 'back' / 'main.py'
    if not main_py.exists():
        print_status("Backend main.py", False, "File not found")
        return False
    
    with open(main_py, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '/api/google-login' in content:
        print_status("Google login endpoint", True, "/api/google-login endpoint found")
    else:
        print_status("Google login endpoint", False, "Endpoint not found in main.py")
        return False
    
    if 'def google_login' in content:
        print_status("Google login function", True, "google_login() function found")
    else:
        print_status("Google login function", False, "Function not found in main.py")
        return False
    
    return True

def check_frontend_code():
    """Check if frontend has Google login components"""
    print_header("Frontend Code Check")
    
    # Check GoogleLoginButton component
    button_path = Path(__file__).parent / 'frontend' / 'src' / 'components' / 'GoogleLoginButton' / 'GoogleLoginButton.jsx'
    if button_path.exists():
        print_status("GoogleLoginButton component", True, "Component found")
    else:
        print_status("GoogleLoginButton component", False, "Component not found")
        return False
    
    # Check if it's used in login page
    login_path = Path(__file__).parent / 'frontend' / 'src' / 'pages' / 'login' / 'login.jsx'
    if login_path.exists():
        with open(login_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'GoogleLoginButton' in content:
            print_status("Login page integration", True, "GoogleLoginButton used in login page")
        else:
            print_status("Login page integration", False, "GoogleLoginButton not imported in login page")
            return False
    else:
        print_status("Login page", False, "login.jsx not found")
        return False
    
    # Check googleAuthService
    service_path = Path(__file__).parent / 'frontend' / 'src' / 'services' / 'googleAuthService.js'
    if service_path.exists():
        print_status("Google Auth Service", True, "googleAuthService.js found")
    else:
        print_status("Google Auth Service", False, "Service file not found")
        return False
    
    return True

def main():
    """Run all checks"""
    print("\n" + "ðŸ”" * 30)
    print("  KisanMitra Google OAuth Configuration Checker")
    print("ðŸ”" * 30)
    
    all_passed = True
    
    # Run all checks
    backend_env_ok = check_backend_env()
    frontend_env_ok = check_frontend_env()
    backend_deps_ok = check_backend_dependencies()
    backend_code_ok = check_backend_code()
    frontend_code_ok = check_frontend_code()
    
    all_passed = all([
        backend_env_ok,
        frontend_env_ok,
        backend_deps_ok,
        backend_code_ok,
        frontend_code_ok
    ])
    
    # Print summary
    print_header("Summary")
    
    if all_passed:
        print("ðŸŽ‰ " + "=" * 56)
        print("   ALL CHECKS PASSED!")
        print("   Your Google login is properly configured.")
        print("   " + "=" * 56)
        print("\nðŸ“ Next Steps:")
        print("   1. Make sure your Google Cloud Console is configured")
        print("   2. Start the backend: cd back && python main.py")
        print("   3. Start the frontend: cd frontend && npm start")
        print("   4. Test Google login at: http://localhost:3000/login")
        print("\nâœ¨ Happy farming with KisanMitra! ðŸŒ¾")
    else:
        print("âš ï¸  " + "=" * 56)
        print("   SOME CHECKS FAILED")
        print("   Please fix the issues above and run this script again.")
        print("   " + "=" * 56)
        print("\nðŸ“– For detailed setup instructions, see:")
        print("   GOOGLE_LOGIN_ACTIVATION_GUIDE.md")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

