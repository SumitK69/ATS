from flask import Flask, request, jsonify
import sqlite3
import os
from werkzeug.utils import secure_filename
from datetime import datetime

from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'doc', 'docx', 'txt'}  # Adjust as needed

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('job_data.db')
    cursor = conn.cursor()
    # Create the job_applications table if not exists
    #!Commented sql queries
    # db.run("DROP TABLE job_applications;");
    #!Commented sql queries
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        contact TEXT,
        resume TEXT,
        job_post_id INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_post_id) REFERENCES job_data(id)
    )
    ''')
    conn.commit()
    conn.close()

# Initialize database
init_db()

@app.route('/api', methods=['GET'])
def get_job_data():
    conn = sqlite3.connect('job_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM job_data')
    rows = cursor.fetchall()
    columns = [description[0] for description in cursor.description]
    data = [dict(zip(columns, row)) for row in rows]
    
    conn.close()
    return jsonify(data)
@app.route('/jobs', methods=['GET'])
def get_jobs():
    page = int(request.args.get('page', 1))
    limit = 20
    offset = (page - 1) * limit
    
    conn = sqlite3.connect('job_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM job_data LIMIT ? OFFSET ?', (limit, offset))
    rows = cursor.fetchall()
    
    # Get column names
    columns = [description[0] for description in cursor.description]
    
    # Convert rows into a list of dictionaries
    data = [dict(zip(columns, row)) for row in rows]
    
    conn.close()
    
    return jsonify({'page': page, 'data': data})


@app.route('/get-cards/<int:id>', methods=['GET'])
def get_job_by_id(id):
    conn = sqlite3.connect('job_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM job_data WHERE id = ?', (id,))
    row = cursor.fetchone()
    
    if row:
        # Get column names
        columns = [description[0] for description in cursor.description]
        
        # Convert the row into a dictionary
        data = dict(zip(columns, row))
        
        conn.close()
        return jsonify(data)
    else:
        conn.close()
        return jsonify({'error': 'Job post not found'}), 404


@app.route('/submit-application', methods=['POST'])
def submit_application():
    # Check if the post request has the file part
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['resume']

    # If the user does not select a file, the browser also submits an empty part without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file is allowed
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{datetime.now().timestamp()}{os.path.splitext(file.filename)[1]}")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    else:
        return jsonify({'error': 'Invalid file format'}), 400

    # Get other fields
    name = request.form.get('name')
    email = request.form.get('email')
    contact = request.form.get('contact')
    job_post_id = request.form.get('jobPostId')

    if not all([name, email, contact, job_post_id, filename]):
        return jsonify({'error': 'Please fill all fields and upload a resume'}), 400

    # Store data in SQLite
    conn = sqlite3.connect('job_data.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO job_applications (name, email, contact, resume, job_post_id) 
    VALUES (?, ?, ?, ?, ?)
    ''', (name, email, contact, filename, job_post_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Application submitted successfully!'}), 200

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(port=5000)
