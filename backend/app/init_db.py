import pymysql

DB_NAME = "users_db"
def create_database():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="Devdb@1992"
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    conn.commit()
    conn.close()
print("Database Created!")
    