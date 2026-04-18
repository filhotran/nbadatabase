# SJSU CMPE 138 SPRING 2026 TEAM5
# File: app.py
# Description: Main entry point for NBA Draft Scouting Database application
# Owner: Filho Tran

from auth import login
from logger import log_info, log_error

def main():
    print("==============================")
    print("  NBA Draft Scouting Database ")
    print("==============================")

    # Public menu (no login required)
    while True:
        print("\n[PUBLIC MENU]")
        print("1. Browse prospects")
        print("2. Search by college")
        print("3. Search by archetype")
        print("4. Login")
        print("5. Exit")

        choice = input("Select an option: ").strip()

        if choice == "1":
            # TODO: call fan_ops.browse_prospects()
            pass
        elif choice == "2":
            # TODO: call fan_ops.search_by_college()
            pass
        elif choice == "3":
            # TODO: call fan_ops.search_by_archetype()
            pass
        elif choice == "4":
            email = input("Email: ").strip()
            password = input("Password: ").strip()
            user = login(email, password)
            if user:
                log_info(f"User {email} logged in successfully")
                role_menu(user)
            else:
                log_error(f"Failed login attempt for {email}")
                print("Invalid credentials.")
        elif choice == "5":
            print("Goodbye.")
            break
        else:
            print("Invalid option.")

def role_menu(user):
    """Route user to their role-specific menu after login."""
    role = user['role']
    print(f"\nWelcome, {user['u_fname']}! Role: {role}")

    if role == 'ADMIN':
        admin_menu(user)
    elif role == 'SCOUT':
        scout_menu(user)
    elif role == 'GM':
        gm_menu(user)
    elif role == 'ANALYST':
        analyst_menu(user)
    elif role == 'FAN':
        fan_menu(user)

def admin_menu(user):
    """TODO: Implement by Teammate 2"""
    pass

def scout_menu(user):
    """TODO: Implement by Teammate 3"""
    pass

def gm_menu(user):
    """TODO: Implement by Teammate 4"""
    pass

def analyst_menu(user):
    """TODO: Implement by Teammate 5"""
    pass

def fan_menu(user):
    """TODO: Implement by Teammate 5"""
    pass

if __name__ == "__main__":
    main()
