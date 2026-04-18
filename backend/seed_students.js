const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, 'batch_swap.db');
const db = new sqlite3.Database(DB_PATH);

const studentsRaw = [
  {student_id:1,  reg_no:"24BBS0158", name:"Aryan Aman",          email:"aryan.aman2024@vitstudent.ac.in",          password:"Aryan@123",   cgpa:8.9, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:2,  reg_no:"24BBS0194", name:"Atharv Agarwal",      email:"atharv.agarwal2024@vitstudent.ac.in",      password:"Atharv@123",  cgpa:7.5, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:3,  reg_no:"24BBS0207", name:"Abhilakshit Tomar",   email:"abhilakshit.tomar2024@vitstudent.ac.in",   password:"Abhi@123",    cgpa:8.2, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:4,  reg_no:"24BBS0234", name:"Rehan Khan",          email:"rehan.khan2024@vitstudent.ac.in",          password:"Rehan@123",   cgpa:7.8, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:55,  reg_no:"24BBS0135", name:"Gulam ",          email:"gulam2024@vitstudent.ac.in",          password:"gulam@123",   cgpa:8.8, current_batch:"C2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:5,  reg_no:"24BBS0050", name:"Aditya Sharma",       email:"aditya.sharma2024@vitstudent.ac.in",       password:"Test@123",    cgpa:8.0, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:6,  reg_no:"24BBS0051", name:"Priya Menon",         email:"priya.menon2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.5, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:7,  reg_no:"24BBS0052", name:"Rahul Nair",          email:"rahul.nair2024@vitstudent.ac.in",          password:"Test@123",    cgpa:7.2, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:8,  reg_no:"24BBS0053", name:"Sneha Patel",         email:"sneha.patel2024@vitstudent.ac.in",         password:"Test@123",    cgpa:9.1, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:9,  reg_no:"24BBS0054", name:"Karan Verma",         email:"karan.verma2024@vitstudent.ac.in",         password:"Test@123",    cgpa:7.9, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:10, reg_no:"24BBS0055", name:"Anjali Iyer",         email:"anjali.iyer2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.3, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:11, reg_no:"24BBS0056", name:"Vikram Singh",        email:"vikram.singh2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.6, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:12, reg_no:"24BBS0057", name:"Pooja Desai",         email:"pooja.desai2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.8, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:13, reg_no:"24BBS0058", name:"Rohit Gupta",         email:"rohit.gupta2024@vitstudent.ac.in",         password:"Test@123",    cgpa:7.4, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:14, reg_no:"24BBS0059", name:"Divya Pillai",        email:"divya.pillai2024@vitstudent.ac.in",        password:"Test@123",    cgpa:9.0, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:15, reg_no:"24BBS0060", name:"Manish Joshi",        email:"manish.joshi2024@vitstudent.ac.in",        password:"Test@123",    cgpa:8.1, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:16, reg_no:"24BBS0061", name:"Riya Kapoor",         email:"riya.kapoor2024@vitstudent.ac.in",         password:"Test@123",    cgpa:7.7, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:17, reg_no:"24BBS0062", name:"Akash Reddy",         email:"akash.reddy2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.6, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:18, reg_no:"24BBS0063", name:"Neha Chopra",         email:"neha.chopra2024@vitstudent.ac.in",         password:"Test@123",    cgpa:7.3, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:19, reg_no:"24BBS0064", name:"Suraj Bose",          email:"suraj.bose2024@vitstudent.ac.in",          password:"Test@123",    cgpa:8.4, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:20, reg_no:"24BBS0065", name:"Kavya Nambiar",       email:"kavya.nambiar2024@vitstudent.ac.in",       password:"Test@123",    cgpa:9.2, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:21, reg_no:"24BBS0066", name:"Dev Malhotra",        email:"dev.malhotra2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.8, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:22, reg_no:"24BBS0067", name:"Swati Bhatt",         email:"swati.bhatt2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.2, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:23, reg_no:"24BBS0068", name:"Nikhil Saxena",       email:"nikhil.saxena2024@vitstudent.ac.in",       password:"Test@123",    cgpa:7.5, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:24, reg_no:"24BBS0069", name:"Tanya Srivastava",    email:"tanya.srivastava2024@vitstudent.ac.in",    password:"Test@123",    cgpa:8.7, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:25, reg_no:"24BBS0070", name:"Arjun Pillai",        email:"arjun.pillai2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.1, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:26, reg_no:"24BBS0071", name:"Ishita Rao",          email:"ishita.rao2024@vitstudent.ac.in",          password:"Test@123",    cgpa:8.9, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:27, reg_no:"24BBS0072", name:"Gaurav Mishra",       email:"gaurav.mishra2024@vitstudent.ac.in",       password:"Test@123",    cgpa:7.6, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:28, reg_no:"24BBS0073", name:"Meera Krishnan",      email:"meera.krishnan2024@vitstudent.ac.in",      password:"Test@123",    cgpa:8.0, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:29, reg_no:"24BBS0074", name:"Harshit Pandey",      email:"harshit.pandey2024@vitstudent.ac.in",      password:"Test@123",    cgpa:9.3, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:30, reg_no:"24BBS0075", name:"Zara Sheikh",         email:"zara.sheikh2024@vitstudent.ac.in",         password:"Test@123",    cgpa:7.9, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:31, reg_no:"24BBS0076", name:"Yash Tripathi",       email:"yash.tripathi2024@vitstudent.ac.in",       password:"Test@123",    cgpa:8.5, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:32, reg_no:"24BBS0077", name:"Sanya Agarwal",       email:"sanya.agarwal2024@vitstudent.ac.in",       password:"Test@123",    cgpa:7.2, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:33, reg_no:"24BBS0078", name:"Pulkit Jain",         email:"pulkit.jain2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.3, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:34, reg_no:"24BBS0079", name:"Aisha Ansari",        email:"aisha.ansari2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.7, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:35, reg_no:"24BBS0080", name:"Tanmay Kulkarni",     email:"tanmay.kulkarni2024@vitstudent.ac.in",     password:"Test@123",    cgpa:8.6, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:36, reg_no:"24BBS0081", name:"Kritika Bansal",      email:"kritika.bansal2024@vitstudent.ac.in",      password:"Test@123",    cgpa:9.0, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:37, reg_no:"24BBS0082", name:"Shubham Yadav",       email:"shubham.yadav2024@vitstudent.ac.in",       password:"Test@123",    cgpa:7.4, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:38, reg_no:"24BBS0083", name:"Lavanya Subramanian", email:"lavanya.subramanian2024@vitstudent.ac.in", password:"Test@123",    cgpa:8.1, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:39, reg_no:"24BBS0084", name:"Parth Shah",          email:"parth.shah2024@vitstudent.ac.in",          password:"Test@123",    cgpa:7.8, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:40, reg_no:"24BBS0085", name:"Simran Kaur",         email:"simran.kaur2024@vitstudent.ac.in",         password:"Test@123",    cgpa:8.4, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:41, reg_no:"24BBS0086", name:"Mayank Rawat",        email:"mayank.rawat2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.6, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:42, reg_no:"24BBS0087", name:"Bhavna Tiwari",       email:"bhavna.tiwari2024@vitstudent.ac.in",       password:"Test@123",    cgpa:8.8, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:43, reg_no:"24BBS0088", name:"Chirag Mehta",        email:"chirag.mehta2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.3, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:44, reg_no:"24BBS0089", name:"Ananya Bhat",         email:"ananya.bhat2024@vitstudent.ac.in",         password:"Test@123",    cgpa:9.1, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:45, reg_no:"24BBS0090", name:"Vivek Pandey",        email:"vivek.pandey2024@vitstudent.ac.in",        password:"Test@123",    cgpa:8.0, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:46, reg_no:"24BBS0091", name:"Shivani Dixit",       email:"shivani.dixit2024@vitstudent.ac.in",       password:"Test@123",    cgpa:7.9, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:47, reg_no:"24BBS0092", name:"Aniket Ghosh",        email:"aniket.ghosh2024@vitstudent.ac.in",        password:"Test@123",    cgpa:8.2, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:48, reg_no:"24BBS0093", name:"Natasha Fernandes",   email:"natasha.fernandes2024@vitstudent.ac.in",   password:"Test@123",    cgpa:7.5, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:49, reg_no:"24BBS0094", name:"Dhruv Chandra",       email:"dhruv.chandra2024@vitstudent.ac.in",       password:"Test@123",    cgpa:8.7, current_batch:"C2", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:50, reg_no:"24BBS0095", name:"Preeti Negi",         email:"preeti.negi2024@vitstudent.ac.in",         password:"Test@123",    cgpa:9.4, current_batch:"A1", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:51, reg_no:"24BBS0096", name:"Sahil Thakur",        email:"sahil.thakur2024@vitstudent.ac.in",        password:"Test@123",    cgpa:7.1, current_batch:"B2", section:"CSE-B", year:1, branch:"CSE", is_active:1},
  {student_id:52, reg_no:"24BBS0097", name:"Aditi Rane",          email:"aditi.rane2024@vitstudent.ac.in",          password:"Test@123",    cgpa:8.3, current_batch:"C1", section:"CSE-C", year:1, branch:"CSE", is_active:1},
  {student_id:53, reg_no:"24BBS0098", name:"Pratham Dubey",       email:"pratham.dubey2024@vitstudent.ac.in",       password:"Test@123",    cgpa:7.7, current_batch:"A2", section:"CSE-A", year:1, branch:"CSE", is_active:1},
  {student_id:54, reg_no:"24BBS0099", name:"Komal Wagh",          email:"komal.wagh2024@vitstudent.ac.in",          password:"Test@123",    cgpa:8.6, current_batch:"B1", section:"CSE-B", year:1, branch:"CSE", is_active:1},
];

db.serialize(() => {
  console.log('Seeding students...');
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, role, reg_no, batch, cgpa, year) 
    VALUES (?, ?, ?, 'student', ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET 
      name=excluded.name, 
      password=excluded.password, 
      reg_no=excluded.reg_no, 
      batch=excluded.batch, 
      cgpa=excluded.cgpa, 
      year=excluded.year
  `);
  
  let promises = studentsRaw.map(async (s) => {
    const hashed = await bcrypt.hash(s.password, 10);
    return new Promise((resolve, reject) => {
      // Omitting student_id so sqlite AUTOINCREMENT does its job without clashing with existing id=1
      stmt.run(s.name, s.email, hashed, s.reg_no, s.current_batch, s.cgpa, s.year, (err) => {
        if (err) {
            console.log("Failed to insert " + s.email + " Error: " + err.message);
            resolve();
        } else resolve();
      });
    });
  });

  Promise.all(promises).then(() => {
    stmt.finalize();
    console.log('Students seeded successfully!');
    db.close();
  });
});
