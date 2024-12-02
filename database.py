import sqlite3

def create_db():
    # Setting the database up
    connect = sqlite3.connect("attendance.db")
    cursor = connect.cursor

    # A table for keeping track of student attendance, using student name, the data, and their attendance status
    cursor.execute('''
    CREATE TABLE IF NOT EXIST attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT CHECK(status IN('present', 'absent')) 
    )
    ''')


    # Commiting changes and closing
    connect.commit()
    connect.close()

# calls function to create db
create_db()