const state = {
  user: null,
  demoMode: false,
  demo: {
    stats: {students:4,subjects:4,faculty:2,lowAttendance:2},
    students: [
      {student_id:1,roll_no:'CSE-101',name:'Aditya Shende',email:'student@college.local',year_level:2,section:'A',department_code:'CSE'},
      {student_id:2,roll_no:'CSE-102',name:'Riya Patil',email:'riya@college.local',year_level:2,section:'A',department_code:'CSE'},
      {student_id:3,roll_no:'CSE-103',name:'Aman Verma',email:'aman@college.local',year_level:2,section:'A',department_code:'CSE'},
      {student_id:4,roll_no:'CSE-104',name:'Neha Joshi',email:'neha@college.local',year_level:2,section:'A',department_code:'CSE'}
    ],
    subjects: [
      {subject_id:1,subject_code:'DBMS',subject_name:'Database Management Systems',semester:4,credits:4},
      {subject_id:2,subject_code:'CN',subject_name:'Computer Networks',semester:4,credits:4},
      {subject_id:3,subject_code:'SEPM',subject_name:'Software Engineering and Project Management',semester:4,credits:3},
      {subject_id:4,subject_code:'DAA',subject_name:'Design and Analysis of Algorithms',semester:4,credits:4}
    ],
    attendance: [
      {roll_no:'CSE-101',student_name:'Aditya Shende',subject_code:'DBMS',total_classes:4,present_classes:3,absent_classes:1,attendance_percentage:75},
      {roll_no:'CSE-101',student_name:'Aditya Shende',subject_code:'CN',total_classes:3,present_classes:3,absent_classes:0,attendance_percentage:100},
      {roll_no:'CSE-102',student_name:'Riya Patil',subject_code:'DBMS',total_classes:2,present_classes:1,absent_classes:1,attendance_percentage:50},
      {roll_no:'CSE-104',student_name:'Neha Joshi',subject_code:'DBMS',total_classes:2,present_classes:0,absent_classes:2,attendance_percentage:0}
    ],
    leaves: [
      {leave_id:1,roll_no:'CSE-101',student_name:'Aditya Shende',from_date:'2026-10-10',to_date:'2026-10-11',reason:'Family function',status:'Pending'},
      {leave_id:2,roll_no:'CSE-102',student_name:'Riya Patil',from_date:'2026-10-12',to_date:'2026-10-13',reason:'Medical appointment',status:'Approved'}
    ]
  }
};

const api = async (url, options={}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

function setMessage(text){document.getElementById('loginMessage').textContent=text||''}
function showApp(){document.getElementById('loginScreen').classList.add('hidden');document.getElementById('appShell').classList.remove('hidden');document.getElementById('roleText').textContent=state.user.role;loadAll()}

async function login(e){
  e.preventDefault(); setMessage('');
  const username=document.getElementById('username').value.trim(); const password=document.getElementById('password').value;
  try{state.user=await api('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})}).then(x=>x.user); state.demoMode=false; showApp();}
  catch(err){
    // Demo fallback keeps the UI usable before MySQL setup.
    const demo={
      'admin@college.local':['admin123','ADMIN'],
      'faculty@college.local':['faculty123','FACULTY'],
      'student@college.local':['student123','STUDENT']
    };
    if(demo[username] && demo[username][0]===password){state.user={username,role:demo[username][1],user_id:demo[username][1]==='STUDENT'?3:demo[username][1]==='FACULTY'?2:1};state.demoMode=true;showApp();document.getElementById('health').textContent='Demo mode - connect MySQL for live data';}
    else setMessage(err.message+' For preview, use the demo credentials shown below.');
  }
}

document.getElementById('loginForm').addEventListener('submit',login);

document.querySelectorAll('.nav-btn[data-section]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active')); document.getElementById(btn.dataset.section).classList.add('active');
  document.getElementById('pageTitle').textContent=btn.textContent;
}));

document.getElementById('logoutBtn').addEventListener('click',()=>location.reload());

async function loadHealth(){if(state.demoMode)return;try{const h=await api('/api/health');document.getElementById('health').textContent=h.database==='connected'?'MySQL connected':'MySQL unavailable';}catch(_){document.getElementById('health').textContent='MySQL unavailable';}}
async function loadStats(){try{const d=state.demoMode?state.demo.stats:await api('/api/dashboard/stats');document.getElementById('statStudents').textContent=d.students;document.getElementById('statSubjects').textContent=d.subjects;document.getElementById('statFaculty').textContent=d.faculty;document.getElementById('statLow').textContent=d.lowAttendance;}catch(_){}}
async function loadStudents(){const rows=state.demoMode?state.demo.students:await api('/api/students');document.getElementById('studentRows').innerHTML=rows.map(s=>`<tr><td>${s.student_id}</td><td>${s.roll_no}</td><td>${s.name}</td><td>${s.email}</td><td>${s.year_level}</td><td>${s.section}</td><td>${s.department_code}</td><td><button class="secondary" onclick="deleteStudent(${s.student_id})">Delete</button></td></tr>`).join('')}
async function addStudent(){const payload={roll_no:stuRoll.value,name:stuName.value,email:stuEmail.value,phone:stuPhone.value,department_id:Number(stuDept.value),year_level:Number(stuYear.value),section:stuSection.value}; if(state.demoMode){state.demo.students.push({...payload,student_id:state.demo.students.length+1,department_code:stuDept.options[stuDept.selectedIndex].text});loadStudents();return;}try{await api('/api/students',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});loadStudents();}catch(e){alert(e.message)}}
async function deleteStudent(id){if(state.demoMode){state.demo.students=state.demo.students.filter(x=>x.student_id!==id);loadStudents();return;}try{await api('/api/students/'+id,{method:'DELETE'});loadStudents();}catch(e){alert(e.message)}}
async function loadSubjects(){const rows=state.demoMode?state.demo.subjects:await api('/api/subjects');document.getElementById('subjectRows').innerHTML=rows.map(s=>`<tr><td>${s.subject_id}</td><td>${s.subject_code}</td><td>${s.subject_name}</td><td>${s.semester}</td><td>${s.credits}</td><td><button class="secondary" onclick="deleteSubject(${s.subject_id})">Delete</button></td></tr>`).join('')}
async function addSubject(){const payload={subject_code:subCode.value,subject_name:subName.value,semester:Number(subSem.value),credits:Number(subCredits.value)};if(state.demoMode){state.demo.subjects.push({...payload,subject_id:state.demo.subjects.length+1});loadSubjects();return;}try{await api('/api/subjects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});loadSubjects();}catch(e){alert(e.message)}}
async function deleteSubject(id){if(state.demoMode){state.demo.subjects=state.demo.subjects.filter(x=>x.subject_id!==id);loadSubjects();return;}try{await api('/api/subjects/'+id,{method:'DELETE'});loadSubjects();}catch(e){alert(e.message)}}
async function loadAttendance(){const rows=state.demoMode?state.demo.attendance:await api('/api/attendance/summary');document.getElementById('attendanceRows').innerHTML=rows.map(a=>`<tr><td>${a.roll_no}</td><td>${a.student_name}</td><td>${a.subject_code}</td><td>${a.total_classes}</td><td>${a.present_classes}</td><td>${a.absent_classes}</td><td>${a.attendance_percentage}%</td><td><span class="pill">${Number(a.attendance_percentage)>=75?'Eligible':'Low Attendance'}</span></td></tr>`).join('')}
async function loadLeaves(){const rows=state.demoMode?state.demo.leaves:await api('/api/leaves');document.getElementById('leaveRows').innerHTML=rows.map(l=>`<tr><td>${l.leave_id}</td><td>${l.roll_no} - ${l.student_name}</td><td>${l.from_date}</td><td>${l.to_date}</td><td>${l.reason}</td><td>${l.status}</td><td><button class="secondary" onclick="approveLeave(${l.leave_id})">Approve</button></td></tr>`).join('')}
async function addLeave(){const payload={student_id:Number(leaveStudent.value),from_date:leaveFrom.value,to_date:leaveTo.value,reason:leaveReason.value};if(state.demoMode){state.demo.leaves.unshift({...payload,leave_id:state.demo.leaves.length+1,roll_no:'CSE-101',student_name:'Aditya Shende',status:'Pending'});loadLeaves();return;}try{await api('/api/leaves',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});loadLeaves();}catch(e){alert(e.message)}}
async function approveLeave(id){if(state.demoMode){const x=state.demo.leaves.find(x=>x.leave_id===id);if(x)x.status='Approved';loadLeaves();return;}try{await api('/api/leaves/'+id+'/status',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'Approved',faculty_id:1})});loadLeaves();}catch(e){alert(e.message)}}

async function loadAll(){loadHealth();loadStats();loadStudents();loadSubjects();loadAttendance();loadLeaves();}
