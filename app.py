from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import os

app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'swiftproject'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# File Upload Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Max content length
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32MB

mysql = MySQL(app)

@app.route('/submit', methods=['POST'])
def submit_application():
    try:
        # Form fields
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        address = request.form.get('address')
        work_experience = request.form.get('work_experience')
        source = request.form.get('source')
        jobid = request.form.get('jobid')
        status = request.form.get('status')
        interviewdate = request.form.get('interviewdate')
        interviewlink = request.form.get('interviewlink')
        company_id = request.form.get('company_id')
        cost = request.form.get('cost')
        status1 = request.form.get('status1')

        # File uploads
        resume_file = request.files.get('resume_path')
        offer_letter_file = request.files.get('offer_letter')

        resume_path = ''
        offer_letter_path = ''

        if resume_file and resume_file.filename:
            resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_file.filename)
            resume_file.save(resume_path)

        if offer_letter_file and offer_letter_file.filename:
            offer_letter_path = os.path.join(app.config['UPLOAD_FOLDER'], offer_letter_file.filename)
            offer_letter_file.save(offer_letter_path)

        # Insert into MySQL
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO job_applications (
                full_name, email, phone, address, work_experience, source,
                resume_path, jobid, status, interviewdate, interviewlink,
                company_id, cost, status1, offer_letter
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            full_name, email, phone, address, work_experience, source,
            resume_path, jobid, status, interviewdate, interviewlink,
            company_id, cost, status1, offer_letter_path
        ))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Application submitted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
